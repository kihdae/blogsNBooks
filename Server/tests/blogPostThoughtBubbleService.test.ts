// blogPostThoughtBubbleService.test.ts
import blogPostThoughtBubbleService from "../services/blogPostThoughtBubbleService";
import prisma from "../prisma/PrismaConnect";
import { BlogPostThoughtBubble, BlogPost, Author } from "@prisma/client";

describe("BlogPostThoughtBubbleService", () => {
  let testAuthor: Author;
  let testBlogPost: BlogPost;
  let createdThoughtBubble: BlogPostThoughtBubble;

  beforeAll(async () => {
    testAuthor = await prisma.author.create({
      data: {
        name: "Test Author",
      },
    });

    testBlogPost = await prisma.blogPost.create({
      data: {
        title: "Test Blog Post",
        content: "Test Content",
      },
    });

    createdThoughtBubble = await prisma.blogPostThoughtBubble.create({
      data: {
        blogPostId: testBlogPost.id,
        content: "Initial Thought Bubble Content",
      },
    });
  });

  afterAll(async () => {
    await prisma.blogPostThoughtBubble.deleteMany({
      where: { blogPostId: testBlogPost.id },
    });
    await prisma.blogPost.deleteMany({
      where: { id: testBlogPost.id },
    });
    await prisma.author.delete({
      where: { id: testAuthor.id },
    });
  });

  it("should create a new blog post thought bubble", async () => {
    const newThoughtBubble =
      await blogPostThoughtBubbleService.createBlogPostThoughtBubble({
        blogPostId: testBlogPost.id,
        content: "New Thought Bubble Content",
      });

    expect(newThoughtBubble).toBeDefined();
    expect(newThoughtBubble.content).toBe("New Thought Bubble Content");

    // Cleanup the created thought bubble
    await prisma.blogPostThoughtBubble.delete({
      where: { id: newThoughtBubble.id },
    });
  });

  it("should retrieve a blog post thought bubble by ID", async () => {
    const retrievedThoughtBubble =
      await blogPostThoughtBubbleService.getBlogPostThoughtBubbleById(
        createdThoughtBubble.id
      );

    expect(retrievedThoughtBubble).toBeDefined();
    expect(retrievedThoughtBubble?.id).toBe(createdThoughtBubble.id);
  });

  it("should retrieve all blog post thought bubbles", async () => {
    const allThoughtBubbles =
      await blogPostThoughtBubbleService.getAllBlogPostThoughtBubbles();

    expect(allThoughtBubbles).toBeDefined();
    expect(allThoughtBubbles.length).toBeGreaterThan(0);
  });

  it("should update a blog post thought bubble", async () => {
    const updatedThoughtBubble =
      await blogPostThoughtBubbleService.updateBlogPostThoughtBubble(
        createdThoughtBubble.id,
        { content: "Updated Thought Bubble Content" }
      );

    expect(updatedThoughtBubble).toBeDefined();
    expect(updatedThoughtBubble.content).toBe("Updated Thought Bubble Content");
  });

  it("should delete a blog post thought bubble", async () => {
    const tempThoughtBubble = await prisma.blogPostThoughtBubble.create({
      data: {
        blogPostId: testBlogPost.id,
        content: "Temporary Thought Bubble",
      },
    });

    const deletedThoughtBubble =
      await blogPostThoughtBubbleService.deleteBlogPostThoughtBubble(
        tempThoughtBubble.id
      );

    expect(deletedThoughtBubble).toBeDefined();
    expect(deletedThoughtBubble.id).toBe(tempThoughtBubble.id);

    const foundThoughtBubble = await prisma.blogPostThoughtBubble.findUnique({
      where: { id: tempThoughtBubble.id },
    });
    expect(foundThoughtBubble).toBeNull();
  });
});
