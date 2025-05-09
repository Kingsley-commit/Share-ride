

export const isBeforeStartTime = (ride) => {

    const currentTime = new Date();
    const startTime = new Date(ride.startTime);

    return currentTime < startTime
}