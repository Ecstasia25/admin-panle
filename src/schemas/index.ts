import * as z from "zod";

export const SettingsSchema = z
  .object({
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(z.string().email()),
    password: z.optional(
      z.string().min(1, {
        message: "The current password is needed to reset the password",
      })
    ),
    newPassword: z.optional(
      z
        .string()
        .min(8, {
          message: "Password must be at least 8 characters",
        })
        .regex(
          new RegExp("(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%&]).{8,32}"),
          {
            message:
              "Password must contain one uppercase letter, one lowercase letter, one number and one of the following characters: * . ! @ $ % &",
          }
        )
    ),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  );

export const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters",
    })
    .regex(
      new RegExp("(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%&#]).{8,32}"),
      {
        message:
          "Password must contain one uppercase letter, one lowercase letter, one number and one of the following characters: * . ! @ $ % &",
      }
    ),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(
    z
      .string()
      .min(1, { message: "Code is required" })
      .max(6, { message: "Code cannot be longer than six chracters" })
  ),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters",
    })
    .regex(
      new RegExp("(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%&#]).{8,32}"),
      {
        message:
          "Password must contain one uppercase letter, one lowercase letter, one number and one of the following characters: * . ! @ $ % &",
      }
    ),
  name: z.string().min(3, {
    message: "Name is required",
  }),
  username: z
    .string()
    .min(1, {
      message: "Username is required",
    })
    .max(15, {
      message: "Username cannot be longer than 15 characters",
    })
    .regex(new RegExp("^[A-Za-z][A-Za-z0-9_]{3,8}$"), {
      message:
        "Username must start with a letter and can only contain letters, numbers and underscores",
    }),
});

export const ProfileEditSchema = z.object({
  name: z.optional(
    z.string().max(50, {
      message: "Name cannot be longer than 50 characters",
    })
  ),
  username: z.optional(
    z
      .string()
      .max(15, {
        message: "Username cannot be longer than 15 characters",
      })
      .regex(new RegExp("^[A-Za-z][A-Za-z0-9_]{3,8}$"), {
        message:
          "Username must start with a letter and can only contain letters, numbers and underscores",
      })
  ),
  bio: z.optional(
    z.string().max(200, {
      message: "Bio cannot be longer than 200 characters",
    })
  ),
});

export const UsernameSetSchema = z.object({
  username: z
    .string()
    .max(15, {
      message: "Username cannot be longer than 15 characters",
    })
    .regex(new RegExp("^[A-Za-z][A-Za-z0-9_]*$"), {
      message:
        "Username must start with a letter and can only contain letters, numbers and underscores",
    }),
});

export const UsernameSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .max(15, { message: "Username cannot be longer than 15 characters" })
    .regex(new RegExp("^[A-Za-z][A-Za-z0-9_]{3,8}$"), {
      message:
        "Username must start with a letter and can only contain letters, numbers and underscores",
    }),
});

export const PictureEditSchema = z.object({
  image: z.optional(z.string().url()),
});

export const UserEditSchema = z.object({
  id: z.string(),
  name: z.optional(
    z.string().min(1, {
      message: "Name cannot be longer than 50 characters",
    })
  ),
  email: z.optional(
    z.string().email({
      message: "Email is required",
    })
  ),
  role: z.optional(z.enum(["USER", "ADMIN"])),
});

export const OnboardingSchema = z.object({
  onboardingDetails: z.object({
    role: z.enum(["Freelancer", "Client"]),
    service: z.optional(z.array(z.string())),
    projectType: z.optional(z.array(z.string())),
    experience: z.optional(z.string()),
    budget: z.optional(z.string()),
  }),
});

export const ProductsSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  description: z.string().min(10, { message: "Description is required" }),
  price: z.string().min(1, { message: "Price is required" }),
  link: z.string().url().min(1, { message: "Link is required" }),
  image: z.array(z.string().url().min(1, { message: "Image is required" })),
});

export const EventsSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  description: z
    .string()
    .min(10, { message: "Description must be minimum 10 characters" }),
  venue: z.string().min(1, { message: "Price is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  link: z.string().url().min(1, { message: "Link is required" }),
  image: z.array(z.string().url().min(1, { message: "Image is required" })),
  eventType: z.enum(["FEATURED", "UPCOMMING", "PAST"]),
  notify: z.boolean(),
  archived: z.boolean(),
});

export const BlogSchema = z.object({
  thumbnail: z.string().url().min(1, { message: "Thumbnail is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  content: z.optional(z.array(z.string())),
  likes: z.number().default(0),
});

export const SupporterSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  image: z.string().url().min(1, { message: "Image is required" }),
});
