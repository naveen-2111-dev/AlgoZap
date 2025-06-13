export async function POST(req: Request) {
    try {
        const {} = await req.json();
        
        return new Response(JSON.stringify({ message: "Success" }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: "Internal Server Error",err }), {
            status: 500,
        });
    }
}