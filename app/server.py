from starlette.applications import Starlette
from starlette.responses import HTMLResponse, JSONResponse
from starlette.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
import uvicorn
import aiohttp
import asyncio
from io import BytesIO
import boto3
import os
import uuid

from fastai import *
from fastai.vision import *

#AWS_ACCESS_KEY_ID = os.getenv('aws_access_key_id')
#AWS_ACCESS_KEY_SECRET = os.getenv('aws_access_key_secret')
bucket_name = 'treeid'

model_file_url = 'https://tamlyn.s3.amazonaws.com/ml/stage2.pth'
model_file_name = 'bark-model2'
classes = ['CAS', 'PLA', 'ACE', 'QUE']
path = Path(__file__).parent

app = Starlette()
app.add_middleware(CORSMiddleware, allow_origins=[
                   '*'], allow_headers=['X-Requested-With', 'Content-Type'])
app.mount('/static', StaticFiles(directory='app/static'))


async def download_file(url, dest):
    if dest.exists():
        return
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            data = await response.read()
            with open(dest, 'wb') as f:
                f.write(data)


async def setup_learner():
    await download_file(model_file_url, path/'models'/f'{model_file_name}.pth')
    data_bunch = ImageDataBunch.single_from_classes(path, classes,
                                                    tfms=get_transforms(), size=512).normalize(imagenet_stats)
    learn = create_cnn(data_bunch, models.resnet34, pretrained=False)
    learn.load(model_file_name)
    return learn


def upload(name, data):
    s3 = boto3.client('s3')
    s3.put_object(Bucket=bucket_name,
                  Key=f'incoming/{name}.jpg', Body=data, ContentType='image/jpeg')


loop = asyncio.get_event_loop()
tasks = [asyncio.ensure_future(setup_learner())]
learn = loop.run_until_complete(asyncio.gather(*tasks))[0]
loop.close()


@app.route('/')
def index(request):
    html = path/'view'/'index.html'
    return HTMLResponse(html.open().read())


@app.route('/analyze', methods=['POST'])
async def analyze(request):
    data = await request.form()
    img_bytes = await (data['file'].read())
    img = open_image(BytesIO(img_bytes))
    name = str(uuid.uuid4())
    upload(name, img_bytes)
    return JSONResponse({
        'result': learn.predict(img)[0],
        'name': name
    })

@app.route('/feedback', methods=['POST'])
async def feedback(request):
    data = await request.json()
    id = data['id']
    actual = data['actual']
    source = f'incoming/{id}.jpg'
    dest = f'labelled/{actual}/{id}.jpg'

    s3 = boto3.client('s3')
    s3.copy_object(Bucket=bucket_name, CopySource=f'{bucket_name}/{source}', Key=dest)
    s3.delete_object(Bucket=bucket_name, Key=source)
    return JSONResponse({})

if __name__ == '__main__':
    if 'serve' in sys.argv:
        uvicorn.run(app, host='0.0.0.0', port=5042)
