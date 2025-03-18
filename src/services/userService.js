import * as argon2 from "argon2";

const UserType = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'superadmin',
};
class UserService {
  #repositorys
  constructor(repository) {
    this.#repositorys = repository
  }


  async createUserService(name, email, password, confirmPassword, role) {
    if (!name || !email || !password || !confirmPassword || !role) {
      return { success: false, status: 400, message: "Please provide all required fields" };
    }
    if (password.length < 6) {
      return { success: false, status: 400, message: "Password must be at least 6 characters long" };
    }
    if (password !== confirmPassword) {
      return { success: false, status: 400, message: "Passwords do not match" };
    }
    if (![UserType.ADMIN, UserType.SUPER_ADMIN].includes(role)) {
      return { success: false, status: 400, message: "Invalid role" };
    }

    const userExists = await this.#repositorys.findUserByEmail(email);
    if (userExists) {
      return { success: false, status: 400, message: "Email already exists" };
    }
    const hashedPassword = await argon2.hash(password);

    const userData = { name, email, password: hashedPassword, role };
    const user = await this.#repositorys.createUser(userData);
    if (!user) {
      return { success: false, status: 500, message: "Error creating user" };
    }

    return { success: true, status: 201, message: "User created successfully", data: user };
  }


  async getAllUserService() {
    try {
      const userDetails = await this.#repositorys.getAllUsers()
      if (!userDetails || userDetails.length === 0) {
        return { success: false, status: 404, message: "No users found." };
      }

      return { success: true, status: 200, message: "Users fetched successfully.", data: userDetails };

    } catch (error) {
      console.error("Error in getAllUserService:", error);
      return { success: false, status: 500, message: "Internal server error. Please try again later." };
    }
  }


async updateUserService(){
  const user = await this.#repositorys.findUserById(id)
  if(!user){
    return { success: false, status: 400, message: "Email already exists" };

  }
}




}

export default UserService