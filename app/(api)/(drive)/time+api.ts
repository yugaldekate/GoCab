interface CalculateTimeProps {
    sourceLatitude: number | null;
    sourceLongitude: number | null;
    destinationLatitude: number | null;
    destinationLongitude: number | null;
}

export const calculateTime = async ({
    sourceLatitude,
    sourceLongitude,
    destinationLatitude,
    destinationLongitude,
}: CalculateTimeProps): Promise<{ duration: number; distance: number } | null> => {
    if (!sourceLatitude || !sourceLongitude || !destinationLatitude || !destinationLongitude) {
        return Promise.reject("Missing coordinates");
    }

    const origins = `${sourceLatitude},${sourceLongitude}`;
    const destinations = `${destinationLatitude},${destinationLongitude}`;

    const url = `https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?origins=${origins}&destinations=${destinations}`;

    const options = {
        method: "GET",
        headers: {
            "x-rapidapi-key": "3e7e777cecmsh754aad8aa9f7fcdp1c37edjsnbf267603477f",
            "x-rapidapi-host": "trueway-matrix.p.rapidapi.com",
        },
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();
        if (result?.durations?.[0]?.[0] !== undefined && result?.distances?.[0]?.[0] !== undefined) {
            return { duration: result.durations[0][0], distance: result.distances[0][0] };
        } else {
            throw new Error("Unexpected API response format");
        }
    } catch (error) {
        console.error("Error fetching travel time:", error);
        return null;
    }
};

export async function POST(request: Request) {
    const body = await request.json();
    const { markers, userLatitude, userLongitude, destinationLatitude, destinationLongitude } = body;

    // Check for missing fields
    if (!userLatitude || !userLongitude || !destinationLatitude || !destinationLongitude) {
        return new Response(JSON.stringify({ error: "Missing time and distance required fields" }), {
            status: 400,
        });
    }

    let responseToDestination: any, responseToUser: any;

    try {
        // Fetch the destination and user times in parallel for efficiency
        const [destinationResult, userResult] = await Promise.all([
            calculateTime({
                sourceLatitude: userLatitude,
                sourceLongitude: userLongitude,
                destinationLatitude,
                destinationLongitude,
            }),
            calculateTime({
                sourceLatitude: markers[0].latitude,
                sourceLongitude: markers[0].longitude,
                destinationLatitude: userLatitude,
                destinationLongitude: userLongitude,
            }),
        ]);

        responseToDestination = destinationResult;
        responseToUser = userResult;

        if (!responseToUser || !responseToDestination) {
            throw new Error("Missing valid responses for time calculations");
        }

    } catch (error) {
        console.error("Error processing time calculations:", error);
        return new Response(JSON.stringify({ error: "Error processing time calculations" }), {
            status: 500,
        });
    }

    try {
        const timesPromises = markers.map(async (marker: { latitude: number; longitude: number }) => {
            try {
                // Generate random price and time adjustments
                const randomPrice = Math.floor(Math.random() * 100) + 10;  // Random price between 10 and 20
                const randomTime = Math.floor(Math.random() * 1000) + 10;  // Random time between 10 and 110 minutes

                // Calculate total time by adding random time to the response duration
                const totalTime = (responseToUser.duration + responseToDestination.duration + randomTime) / 60; // Convert to minutes

                // Calculate price assuming 0.5 per minute plus random price
                const price = (totalTime * 0.5 + randomPrice).toFixed(2);  // Adding random price to the base price

                return { ...marker, time: totalTime, price, distance: responseToDestination.distance };
            } catch (error) {
                console.error("Error processing marker:", error);
                return { ...marker, time: null, price: null };
            }
        });

        const driverTimes = await Promise.all(timesPromises);

        return new Response(JSON.stringify(driverTimes), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error calculating driver times:", error);
        return new Response(JSON.stringify({ error: "Error calculating driver times" }), {
            status: 500,
        });
    }
}
