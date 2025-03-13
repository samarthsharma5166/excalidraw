import express from 'express'
import { createRoomSchema, createUser, signInSchema } from "@repo/common/types";
import {prisma} from '@repo/db/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'  
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from './middleware';
import cors from 'cors'
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

app.post('/signup', async(req, res) => { 

    try {
      console.log(req.body)
          const { username, email, password } = req.body;
          console.log(username, email, password);
          if (!username || !email || !password) {
            res.status(400).json({
              message: "all fields are required",
            });
            return;
          }
          const data =  createUser.safeParse(req.body);
          if (!data.success) {
            console.log(data.error)
            res.status(400).json({
              message: "incorrect inputs",
            });
            return;
          }  

      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      console.log(existingUser)
      if (existingUser) {
        res.status(400).json({
          message: "user already exists",
        });
        return;
      }
      const hashpassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password:hashpassword,
        },
      });
      res.status(200).json({
        message: "success",
        user,
      });
      return
    } catch (error) {
      console.log(error)
      res.status(500).json({
        message: "something went wrong",
      });   
    }
})  

app.post("/signin", async(req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "all fields are required",
      });
      return;
    }
    const data = signInSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({
        message: "incorrect inputs",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !user?.password) {
      res.status(400).json({
        message: "user not found",
      });
      return;
    }
    const passwordValid = await bcrypt.compare(password, user?.password);

    if (passwordValid) {
      res.status(400).json({
        message: "incorrect password",
      });
      return;
    }

    const token = await jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      JWT_SECRET
    );

    res.status(200).json({
      token,
      message: "success",
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "something went wrong",
    });
  }

});  

app.post("/room", middleware ,async(req, res) => {
  try {
    console.log(req.body);
    const parsedData = createRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
      console.log(parsedData.error);
      res.status(400).json({
        message: "incorrect inputs",
      });
      return;
    }
    // @ts-ignore
    const { id, email } = await req.user;
    const roomExists = await prisma.room.findUnique({
      where: {
        slug: parsedData.data.name,
      },
    });
    if (roomExists) {
      res.status(400).json({
        message: "room already exists",
      });
      return;
    }
    const room = await prisma.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: id,
      },
    });

    res.status(200).json({
      message: "success",
      room,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "something went wrong",
    });
  }
});  

app.get("/chat/:roomId", middleware, async(req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    if (!roomId) {
      res.status(400).json({
        message: "roomId is required",
      });
      return;
    }
    const messages = await prisma.chat.findMany({
      where:{
       roomId
      },
      orderBy:{
        id:'desc'
      },
      take:1000
    })

    res.status(200).json({
      message: "success",
      messages
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "something went wrong",
    });
  }
})

app.get("/room/:slug", middleware, async(req, res) => {
  try {
    const slug = req.params.slug;
    console.log(slug)
    if (!slug) {
      res.status(400).json({
        message: "slug is required",
      });
      return;
    }
    const room = await prisma.room.findUnique({
      where:{
        slug
      }
    })

    res.status(200).json({
      message: "success",
      room
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "something went wrong",
    });
  }
})
app.listen(3004, () => {
  console.log("server is running on port 3004");
})