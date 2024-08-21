import { writeFileSync } from "node:fs";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { path = null } = req.body.path;
	if (!path) {
		res.status(400).json({ name: "no path provided" });
	} else {
		// your file content here
		const content = req.body.encodedContent;
		try {
			writeFileSync(`~/server/images/${path}`, content);
            res.json({
                path,
                content,
            });
            console.log(res);
            
		} catch (error) {
            res.json({
                error: error,
            })
            console.log(error);
            
        }

		
	}
}
