from pydantic import BaseModel


class Dependency(BaseModel):
    name: str
    version: str
    summary: str | None = None
    license: str | None = None
    home_page: str | None = None
