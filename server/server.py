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

bucket_name = 'treeid'

model_file_url = 'https://tamlyn.s3.amazonaws.com/ml/stage2-512.pth'
model_file_name = 'bark-model3'
classes = ['PLA', 'ULM', 'SAL', 'TIL', 'ACE', 'CAS']
path = Path(__file__).parent

app = Starlette()

async def download_file(url, dest):
    if dest.exists():
        return
    async with aiohttp.ClientSession() as session:
        print('Downloading model...')
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


@app.route('/analyze', methods=['POST'])
async def analyze(request):
    data = await request.form()
    img_bytes = await (data['file'].read())
    img = open_image(BytesIO(img_bytes))
    fileId = str(uuid.uuid4())
    upload(fileId, img_bytes)
    return JSONResponse({
        'result': learn.predict(img)[0],
        'fileId': fileId
    })

@app.route('/feedback', methods=['POST'])
async def feedback(request):
    data = await request.json()
    fileId = data['fileId']
    actual = data['actual']
    source = f'incoming/{fileId}.jpg'
    dest = f'labelled/{actual}/{fileId}.jpg'

    s3 = boto3.client('s3')
    s3.copy_object(Bucket=bucket_name, CopySource=f'{bucket_name}/{source}', Key=dest)
    s3.delete_object(Bucket=bucket_name, Key=source)
    return JSONResponse({})

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=5042)
