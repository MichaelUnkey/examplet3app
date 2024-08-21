import { readFileSync } from 'node:fs';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { path = '' } = req.query;
    if (!path) {
        res.status(400).json({ name: 'wrong' })
    } else {
        res.send(readFileSync(`/tmp/${path}`));
    }
}