from fastapi import FastAPI, Response, status, Body, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
import os

dir_path = os.path.dirname(os.path.realpath(__file__))


app = FastAPI()


@ app.post("/login")
async def login(password: str = Body(...)):
    normalized = password.lower().replace(" ", "")
    if normalized == "lavieenrose":
        return RedirectResponse("/pages/lavieenrose.html")
    else:
        raise HTTPException(status_code=401, detail="Incorrect password")


@ app.on_event("startup")
async def startup_event():
    print("Test is starting up.")


@ app.on_event("shutdown")
def shutdown_event():
    print("Test is exiting.", "Wait a moment until completely exits.")


app.mount("/", StaticFiles(directory="web", html=True))


if __name__ == '__main__':
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, log_level="info")