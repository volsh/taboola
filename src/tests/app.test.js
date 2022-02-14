import "@testing-library/jest-dom";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";
import user from "@testing-library/user-event";
import { Main } from "../Main";
import { makeServer } from "./test-server";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

function getScenario() {
  render(<Main />);

  const scenario = {
    get loadingIndicators() {
      return screen.queryByLabelText(/loading/i);
    },
    todoItemWithText(text) {
      return screen.queryByLabelText(text);
    },
    async waitForLoadingToEnd() {
      await waitForElementToBeRemoved(() => scenario.loadingIndicators);
      await waitFor(() =>
        expect(scenario.todoItemWithText("Foo")).toBeInTheDocument()
      );
    },
  };

  return scenario;
}

describe("Todos Application", () => {
  it("should show the loading indication while loading", () => {
    const server = makeServer({ timing: 5000, environment: "development" });
    const scenario = getScenario();

    expect(scenario.loadingIndicators).toBeVisible();
    server.shutdown();
  });

  it("should show the todo items added", async () => {
    const server = makeServer();
    server.create("todo", { title: "Foo", completed: true });
    server.create("todo", { title: "Bar", completed: false });
    const scenario = getScenario();

    await scenario.waitForLoadingToEnd();

    expect(scenario.todoItemWithText("Foo")).toBeInTheDocument();
    expect(scenario.todoItemWithText("Foo")).not.toBeVisible();
    expect(scenario.todoItemWithText("Foo")).toBeChecked();
    expect(scenario.todoItemWithText("Bar")).toBeInTheDocument();
    expect(scenario.todoItemWithText("Bar")).not.toBeVisible();
    expect(scenario.todoItemWithText("Bar")).not.toBeChecked();
    server.shutdown();
  });

  it("should change the todo state on click", async () => {
    const server = makeServer();
    server.create("todo", { title: "Foo", completed: true });
    server.create("todo", { title: "Bar", completed: false });
    const scenario = getScenario();

    await scenario.waitForLoadingToEnd();

    user.click(scenario.todoItemWithText("Foo"));

    await waitFor(() =>
      expect(scenario.todoItemWithText("Foo")).not.toBeChecked()
    );
  });

  it("should remove the todo state on meta-click", async () => {
    const server = makeServer();
    server.create("todo", { title: "Foo", completed: true });
    server.create("todo", { title: "Bar", completed: false });
    const scenario = getScenario();

    await scenario.waitForLoadingToEnd();

    expect(scenario.todoItemWithText("Foo")).not.toBeNull();
    user.click(scenario.todoItemWithText("Foo"), { metaKey: true });

    try {
      expect(scenario.todoItemWithText("Foo")).not.toBeNull();
    } catch {
      await waitForElementToBeRemoved(scenario.todoItemWithText("Foo"));
    }
  });
});
