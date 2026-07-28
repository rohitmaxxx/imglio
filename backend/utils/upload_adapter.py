"""Adapts a FastAPI UploadFile to the minimal `.stream`/`.filename` shape services.open_image expects."""

from fastapi import UploadFile


class UploadAdapter:
    def __init__(self, upload: UploadFile):
        self.stream = upload.file
        self.filename = upload.filename


def to_upload_adapter(upload: UploadFile) -> UploadAdapter:
    return UploadAdapter(upload)
