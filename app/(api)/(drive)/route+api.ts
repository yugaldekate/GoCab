export async function POST(request: Request) {

    const body = await request.json();
    const { sourceLatitude, sourceLongitude, destinationLatitude, destinationLongitude } = body;

    // Check for missing fields
    if (!sourceLatitude || !sourceLongitude || !destinationLatitude || !destinationLongitude) {
        return new Response(JSON.stringify({ error: "Missing route required fields" }), {
            status: 400,
        });
    }

    // Validate coordinates to ensure they are numbers
    if (![sourceLatitude, sourceLongitude, destinationLatitude, destinationLongitude].every(coord => typeof coord === "number")) {
        console.error("Invalid coordinates provided");
        return new Response(JSON.stringify({ error: "Invalid coordinates provided" }), {
            status: 400,
        });
    }

    // Directly construct the URL with query parameters
    const url = `https://trueway-directions2.p.rapidapi.com/FindDrivingRoute?stops=${sourceLatitude},${sourceLongitude};${destinationLatitude},${destinationLongitude}`;

    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": "303c62c77fmsh8641af55211efc3p1df84cjsn3585047e62e2",
            "X-RapidAPI-Host": "trueway-directions2.p.rapidapi.com",
        },
    };

    try {
        // Fetch route data
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

        const data = await response.json();

        // Check if the response structure is correct
        if (!data?.route?.geometry?.coordinates) {
            throw new Error("Invalid API response structure");
        }

        // Process the coordinates
        const coordinates = data.route.geometry.coordinates.map((point: [number, number]) => ({
            latitude: point[0],
            longitude: point[1]
        }));

        // Return the coordinates as a JSON response
        return new Response(JSON.stringify({ coordinates }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error fetching route directions:", error);
        return new Response(JSON.stringify({ error: "Error fetching route directions" }), {
            status: 500,
        });
    }
}
