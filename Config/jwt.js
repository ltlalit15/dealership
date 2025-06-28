import jwt from 'jsonwebtoken';

export const generatetoken = async (id) => {
        // console.log('Token received:', process.env.JWT_SECRET);

    return await jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
