import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../prisma/client";

type Session = {
  email: string 
  id: string
 }
 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session = await getServerSession(req, res, authOptions);
    if (!session)
      return res
        .status(401)
        .json({ message: "Por favor, logue em sua conta!" });

    //Get Auth User Posts
    try {
    const data = await prisma.user.findUnique({
        where: {
            email: session.user?.email as string
        } as Session,
        include: {
            Post: {
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    Comment: true
                }
            }
        }
    })
      res.status(200).json(data)
    } catch (err) {
      res.status(403).json({err: "Erro ocorrido ao buscar posts!"})

    }
  }
}
