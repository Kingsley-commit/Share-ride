
import User from "../../user/model/user.js";
import Vehicle from "../../user/model/vehicle.js";
import Route from "../../routing/models/routes.js";
import Ride from "../../routing/models/ride.js";
import Rating from "../../rating/models/rate-ride.js";




User.hasMany(Vehicle, {
  foreignKey: "ownerId",
  as: "vehicles",
  onDelete: "CASCADE",
});

// Vehicle belongs to a User
Vehicle.belongsTo(User, {
  foreignKey: "ownerId",
  as: "owner",
});

Ride.hasOne(Route, {
  foreignKey: "rideId",
  as: "route",
  onDelete: "CASCADE",
});

Route.belongsTo(Ride, {
  foreignKey: "rideId",
  as: "ride",
  onDelete: "CASCADE",
});

// Ride and Vehicle Association
Ride.belongsTo(Vehicle, {
  foreignKey: "vehicleId",
  as: "vehicle",
  onDelete: "CASCADE",
});

// Ride and User Association (Driver)
Ride.belongsTo(User, {
  foreignKey: "driverId",
  as: "driver",
  onDelete: "CASCADE",
});

// Ride and Rating Association
Rating.belongsTo(Ride, {
  foreignKey: "rideId",
  as: "ride",
  onDelete: "CASCADE",
});

// Rating and User Association
Rating.belongsTo(User, {
  foreignKey: "raterId",
  as: "rater",
  onDelete: "CASCADE",
});

Rating.belongsTo(User, {
  foreignKey: "ratedId",
  as: "rated",
  onDelete: "CASCADE",
});

Ride.hasMany(Rating, {
  foreignKey: "rideId",
  as: "ratings",
  onDelete: "CASCADE",
});
