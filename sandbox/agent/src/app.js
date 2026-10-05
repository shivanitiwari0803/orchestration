import express from "express";
import morgan from "morgan";
import fs from "fs";

const WORKING_DIR = "/workspace";
const app = express();

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "hello from sandbox agent",
    status: "success",
  });
});

app.get("/list-files", async (req, res) => {
  const elements = await fs.promises.readdir(WORKING_DIR);

  res.status(200).json({
    message: "Elements in working directory",
    elements,
  });
});

app.get("/read-files", async (req, res) => {
  const files = req.query.files;

  if (!files) {
    return res.status(400).json({
      message: "No files specified in query parameter",
      status: "error",
    });
  }
  const fileList = files.split(",");

  const results = await Promise.all(
    fileList.map(async (file) => {
      const filePath = `${WORKING_DIR}/${file}`;
      try {
        const content = await fs.promises.readFile(filePath, "utf-8");
        return {
          [filePath]: content,
        };
      } catch (err) {
        return {
          [filePath]: `error reading file : ${err.message}`,
        };
      }
    }),
  );
 res.status(200).json({
    message: "file contents",
    files: results
  })

  app.patch("/update-files", async(req,res)=>{
    const updates = req.body.updates

    if(!updates || !Array.isArray(updates)) {
       return res.status(400).json({
        message : "Invalid request body. Expected a JSON object with an 'updates' property containing an array of file updates.",
        status : " error"
       })
    }
    const results = await Promise.all(updates.map(async (update)=>{
      const {file,content} = update
      const filePath = path.join(WORKING_DIR, file)
      try{
        await fs.promises.writeFile(filePath,content,"utf-8")
        return {
           [filePath] : 'file uploaded successfully'
        }
      }
      catch (err){
        return {
          [filePath] : `error updating file: ${err.message}`
        }
      }
    }))

    res.status(200).json({
      message : "file update results",
      results
    })
  })

});

export default app;
