import Joi from "joi"
import User from "../models/user"
import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes"
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


export const signInSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.base": `"email" phải là kiểu "text"`,
        "string.empty": `"email" không được bỏ trống`,
        "string.email": `"email" phải có định dạng là email`,
        "any.required": `"email" là trường bắt buộc`,
    }),
    password: Joi.string().required().messages({
        "string.base": `"password" phải là kiểu "text"`,
        "string.empty": `"password" không được bỏ trống`,
        "string.min": `"password" phải chứa ít nhất {#limit} ký tự`,
        "any.required": `"password" là trường bắt buộc`,
    }),
});

export const signupSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        "any.required": "Trường name là bắt buộc",
        "string.empty": "Trường name không được để trống",
        "string.min": "Trường name phải có tối thiểu {#limit} kí tự",
        "string.max": "Trường name không được vượt quá {#limit} kí tự",
    }),
    email: Joi.string().email().required().messages({
        "any.required": "Email bắt buộc phải nhập",
        "string.empty": "Email không được để trống",
        "string.email": "Cần nhập email hợp lệ",
    }),
    password: Joi.string().min(6).max(30).required().messages({
        "any.required": "Trường password là bắt buộc",
        "string.empty": "Trường password không được để trống",
        "string.min": "Trường password phải có tối thiểu {#limit} kí tự",
        "string.max": "Trường password không được vượt quá {#limit} kí tự",
    }),
    confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
        "any.required": "Trường confirm password là bắt buộc",
        "any.only": "Confirm password phải giống với Password",
    }),
    avatar: Joi.string().uri().messages({
        "string.uri": "Đường dẫn không hợp lệ",
    }),
});

export const signup = async (req, res) => {
    const { email, password, name, avatar } = req.body;
    const { error } = signupSchema.validate(req.body, { abortEarly: false })
    if (error) {
        const messages = error.details.map((item) => item.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            messages,
        })
    }
    const existUser = await User.findOne({ email });
    if (existUser) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            messages: ["Email da ton tai"]
        })
    }
    const hashedPassword = await bcryptjs.hash(password, 12);
    console.log(hashedPassword);
    const role = (await User.countDocuments({})) === 0 ? "admin" : "user"

    const user = await User.create({
        ...req.body, password: hashedPassword, role,
    });
    return res.status(StatusCodes.CREATED).json({
        user,
    })
}


export const signin = async (req, res) => {
    dotenv.config();

    // Lấy secret key từ biến môi trường
    const secretKey = process.env.JWT_SECRET;

    const { email, password } = req.body;

    try {
        const { error } = signInSchema.validate(req.body)
        if (error) {
            const errorMessage = error.details.map(item => item.message)
            return res.status(400).json({ message: errorMessage })
        }

        // Tìm người dùng trong cơ sở dữ liệu bằng email
        const user = await User.findOne({ email });
        console.log(user, "::", password, user.password, ":::::")
        // Nếu không tìm thấy người dùng, trả về lỗi "Unauthorized"
        if (!user) {
            return res.status(400).json({ message: "Khong tim thay tai khoan" })
        }

        // So sánh mật khẩu đã nhập với mật khẩu đã được hash trong cơ sở dữ liệu
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        console.log(isPasswordValid, "::")
        // Nếu mật khẩu không chính xác, trả về lỗi "Unauthorized"
        if (!isPasswordValid) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Email hoặc mật khẩu không chính xác.' });
        }

        // Tạo token JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            secretKey, // Sử dụng secret key từ biến môi trường
            { expiresIn: '1h' } // Thời hạn của token
        );
        user.password = undefined
        // Trả về token và thông tin người dùng
        return res.status(StatusCodes.OK).json({ token, userId: user, expiresIn: 3600 });
    } catch (error) {
        console.error('Đã xảy ra lỗi khi đăng nhập:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Đã xảy ra lỗi khi đăng nhập.' });
    }
};



const getUsetList = async (req, res) => {
    const { _id } = req.user
    try {

        const user = await User.find();
        user.password = undefined
        res.json({
            message: "Lay du lieu thanh cong",
            data: user
        })
    } catch (error) {
        throw new Error("Ban phai dang nhap moi dc")
    }
}

const get_one_user = async (req, res) => {
    const { id } = req.params
    try {

        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: "Khong tim thay user" })
        }
        res.json({
            message: "Lay du lieu thanh cong",
            data: user,
        })
    } catch (error) {
        throw new Error("Ban phai dang nhap moi dc")
    }
}

// detete a single user
const deleteaUser = async (req, res) => {
    const { id } = req.params

    try {
        const userDelete = await User.findByIdAndDelete(id)
        res.json(userDelete)
    } catch (error) {
        throw new Error(error)
    }
}
// update  a user
const updateaUser = async (req, res) => {
    const { _id } = req.user;
    // check id 

    try {
        const result = await User.findByIdAndUpdate(_id, req.body, {
            new: true
        })
        res.json(result)
    } catch (error) {
        throw new Error(error)
    }
}
