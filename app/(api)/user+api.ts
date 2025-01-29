import { neon } from '@neondatabase/serverless';

const sql = neon(`${process.env.DATABASE_URL}`);

export async function POST(request: Request) {
    try {
        const { name, email, clerkId } = await request.json();

        if (!name || !email || !clerkId) {
            return Response.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Use parameterized queries to prevent SQL injection
        const response = await sql`
            INSERT INTO users (name, email, clerk_id)
            VALUES (${name}, ${email}, ${clerkId})
            RETURNING *;
        `;

        return new Response(JSON.stringify({ data: response }), { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
