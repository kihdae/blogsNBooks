// import {
//   AbilityBuilder,
//   Ability,
//   AbilityClass,
//   InferSubjects,
// } from "@casl/ability";

// // Import Prisma models (classes) directly
// import {
//   Book,
//   Review,
//   BlogPost,
//   Author,
//   Quote,
//   BookThoughtBubble,
//   BlogPostThoughtBubble,
//   User,
// } from "./prisma/client"; // Adjust path if needed

// type Subjects = InferSubjects<
//   | typeof Book
//   | typeof Review
//   | typeof BlogPost
//   | typeof Author
//   | typeof Quote
//   | typeof BookThoughtBubble
//   | typeof BlogPostThoughtBubble
//   | typeof User
//   | "all"
// >;
// type Actions = "read" | "create" | "update" | "delete" | "manage";
// type AppAbility = Ability<[Actions, Subjects]>;

// const AppAbility = Ability as AbilityClass<AppAbility>;

// export function defineAbilitiesFor(user: { id: number; username: string; isAdmin: boolean } | null) {
//   const { can, cannot, build } = new AbilityBuilder<AppAbility>(AppAbility);

//   if (user) {
//     // Basic user abilities
//     can("read", Book);
//     can("read", Review);
//     can("read", BlogPost);
//     can("read", Author);
//     can("read", Quote);
//     can("read", BookThoughtBubble);
//     can("read", BlogPostThoughtBubble);
//     can("read", User, { id: user.id });

//     // Review creation/modification abilities
//     can("create", Review);
//     can("update", Review, { reviewer: user.username });
//     can("delete", Review, { reviewer: user.username });

//     // BlogPost creation/modification abilities
//     can("create", BlogPost);
//     can("update", BlogPost, { authorId: user.id });
//     can("delete", BlogPost, { authorId: user.id });

//     // Book creation/modification abilities
//     can("create", Book);
//     can("update", Book, { authorId: user.id });
//     can("delete", Book, { authorId: user.id });

//     // BookThoughtBubble modification abilities
//     can("create", BookThoughtBubble);
//     can("update", BookThoughtBubble, { book: { authorId: user.id } });
//     can("delete", BookThoughtBubble, { book: { authorId: user.id } });

//     // BlogPostThoughtBubble modification abilities
//     can("create", BlogPostThoughtBubble);
//     can("update", BlogPostThoughtBubble, { blogPost: { authorId: user.id } });
//     can("delete", BlogPostThoughtBubble, { blogPost: { authorId: user.id } });

//     if (user.isAdmin) {
//       can("manage", "all");
//     }
//   } else {
//     can("read", Book);
//     can("read", Review);
//     can("read", BlogPost);
//     can("read", Author);
//     can("read", Quote);
//     can("read", BookThoughtBubble);
//     can("read", BlogPostThoughtBubble);
//   }

//   return build();
// }