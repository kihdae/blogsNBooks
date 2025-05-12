import { Request, Response } from "express";
import bookThoughtBubbleController from "../controllers/bookThoughtBubbleController";
import bookThoughtBubbleService from "../services/bookThoughtBubbleService";
import { BookThoughtBubble, Book } from "@prisma/client";

type BookThoughtBubbleWithRelations = BookThoughtBubble & {
  book: Book;
};

jest.mock("../services/bookThoughtBubbleService");
const mockedBookThoughtBubbleService = bookThoughtBubbleService as jest.Mocked<
  typeof bookThoughtBubbleService
>;

describe("BookThoughtBubbleController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockSend: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockSend = jest.fn();
    mockStatus = jest.fn().mockReturnThis();

    mockRequest = {};
    mockResponse = {
      json: mockJson,
      send: mockSend,
      status: mockStatus,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createBookThoughtBubble", () => {
    it("should create a book thought bubble and return 201", async () => {
      const mockData: BookThoughtBubble = {
        id: 1,
        bookId: 1,
        content: "Test Content",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockedBookThoughtBubbleService.createBookThoughtBubble.mockResolvedValue(
        mockData
      );
      mockRequest.body = { bookId: 1, content: "Test Content" };

      await bookThoughtBubbleController.createBookThoughtBubble(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(
        mockedBookThoughtBubbleService.createBookThoughtBubble
      ).toHaveBeenCalledWith(mockRequest.body);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockData);
    });

    it("should return 400 on service error", async () => {
      mockedBookThoughtBubbleService.createBookThoughtBubble.mockRejectedValue(
        new Error("Service Error")
      );
      mockRequest.body = { bookId: 1, content: "Test Content" };

      await bookThoughtBubbleController.createBookThoughtBubble(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: "Service Error" });
    });
  });

  describe("getBookThoughtBubbleById", () => {
    it("should get a book thought bubble by ID and return it", async () => {
      const mockData: BookThoughtBubbleWithRelations = {
        id: 1,
        bookId: 1,
        content: "Test Content",
        createdAt: new Date(),
        updatedAt: new Date(),
        book: {} as Book,
      };
      mockedBookThoughtBubbleService.getBookThoughtBubbleById.mockResolvedValue(
        mockData
      );
      mockRequest.params = { id: "1" };

      await bookThoughtBubbleController.getBookThoughtBubbleById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(
        mockedBookThoughtBubbleService.getBookThoughtBubbleById
      ).toHaveBeenCalledWith(1);
      expect(mockJson).toHaveBeenCalledWith(mockData);
    });

    it("should return 404 if book thought bubble is not found", async () => {
      mockedBookThoughtBubbleService.getBookThoughtBubbleById.mockResolvedValue(
        null
      );
      mockRequest.params = { id: "1" };

      await bookThoughtBubbleController.getBookThoughtBubbleById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Book thought bubble not found",
      });
    });

    it("should return 400 for invalid ID", async () => {
      mockRequest.params = { id: "invalid" };

      await bookThoughtBubbleController.getBookThoughtBubbleById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: "Invalid ID" });
    });

    it("should return 400 on service error", async () => {
      mockedBookThoughtBubbleService.getBookThoughtBubbleById.mockRejectedValue(
        new Error("Service Error")
      );
      mockRequest.params = { id: "1" };

      await bookThoughtBubbleController.getBookThoughtBubbleById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: "Service Error" });
    });
  });

  describe("getAllBookThoughtBubbles", () => {
    it("should get all book thought bubbles and return them", async () => {
      const mockData: BookThoughtBubbleWithRelations[] = [
        {
          id: 1,
          bookId: 1,
          content: "Test Content 1",
          createdAt: new Date(),
          updatedAt: new Date(),
          book: {} as Book,
        },
        {
          id: 2,
          bookId: 2,
          content: "Test Content 2",
          createdAt: new Date(),
          updatedAt: new Date(),
          book: {} as Book,
        },
      ];
      mockedBookThoughtBubbleService.getAllBookThoughtBubbles.mockResolvedValue(
        mockData
      );

      await bookThoughtBubbleController.getAllBookThoughtBubbles(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(
        mockedBookThoughtBubbleService.getAllBookThoughtBubbles
      ).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(mockData);
    });

    it("should return 500 on service error", async () => {
      mockedBookThoughtBubbleService.getAllBookThoughtBubbles.mockRejectedValue(
        new Error("Service Error")
      );

      await bookThoughtBubbleController.getAllBookThoughtBubbles(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: "Service Error" });
    });
  });

  describe("updateBookThoughtBubble", () => {
    it("should update a book thought bubble and return it", async () => {
      const mockData: BookThoughtBubble = {
        id: 1,
        bookId: 1,
        content: "Updated Content",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockedBookThoughtBubbleService.updateBookThoughtBubble.mockResolvedValue(
        mockData
      );
      mockRequest.params = { id: "1" };
      mockRequest.body = { content: "Updated Content" };

      await bookThoughtBubbleController.updateBookThoughtBubble(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(
        mockedBookThoughtBubbleService.updateBookThoughtBubble
      ).toHaveBeenCalledWith(1, mockRequest.body);
      expect(mockJson).toHaveBeenCalledWith(mockData);
    });

    it("should return 400 on service error", async () => {
      mockedBookThoughtBubbleService.updateBookThoughtBubble.mockRejectedValue(
        new Error("Service Error")
      );
      mockRequest.params = { id: "1" };
      mockRequest.body = { content: "Updated Content" };

      await bookThoughtBubbleController.updateBookThoughtBubble(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: "Service Error" });
    });
  });

  describe("deleteBookThoughtBubble", () => {
    it("should delete a book thought bubble and return 204", async () => {
      mockedBookThoughtBubbleService.deleteBookThoughtBubble.mockResolvedValue(
        {} as BookThoughtBubble
      );
      mockRequest.params = { id: "1" };

      await bookThoughtBubbleController.deleteBookThoughtBubble(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(
        mockedBookThoughtBubbleService.deleteBookThoughtBubble
      ).toHaveBeenCalledWith(1);
      expect(mockStatus).toHaveBeenCalledWith(204);
      expect(mockSend).toHaveBeenCalled();
    });

    it("should return 400 for invalid ID", async () => {
      mockRequest.params = { id: "invalid" };

      await bookThoughtBubbleController.deleteBookThoughtBubble(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: "Invalid ID" });
    });

    it("should return 400 on service error", async () => {
      mockedBookThoughtBubbleService.deleteBookThoughtBubble.mockRejectedValue(
        new Error("Service Error")
      );
      mockRequest.params = { id: "Invalid ID" };
    });

    it("should return 400 on service error", async () => {
      mockedBookThoughtBubbleService.deleteBookThoughtBubble.mockRejectedValue(
        new Error("Service Error")
      );
      mockRequest.params = { id: "1" };

      await bookThoughtBubbleController.deleteBookThoughtBubble(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: "Service Error" });
    });
  });
});
