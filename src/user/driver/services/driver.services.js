import User from "../../model/user.js";

export class UserService {
  static async getDriverById(driverId) {
    const driver = await User.findByPk(driverId);

      return {
          driverId: driver.id,
          firstName: driver.firstName,
          lastName: driver.lastName,
          email: driver.email,
          company: driver.companyName,
    }
  }

  static async getUserById(userId) {
    const user = await User.findByPk(userId);

    return user;
  }
}
