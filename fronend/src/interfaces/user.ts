export interface UserLogin {
  email: string;
  password: string;
}

export interface User {
  email: string;
  role: string;
  _id: string;
}


export interface UserLogin {
    email: string;
    password: string;
  }
  
  export interface RegisterType extends UserLogin {
    confirmPassword: string;
    name?: string;
  }
  