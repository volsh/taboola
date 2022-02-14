import { createServer, Model, RestSerializer } from "miragejs";
import { API_HOST } from "../api";

export function makeServer({ environment = "test", timing = 0 } = {}) {
  let server = createServer({
    environment,

    models: {
      todo: Model
    },

    serializers: {
      application: RestSerializer.extend({
        root: false,
        embed: true
      })
    },

    seeds(server) {
      server.create("todo", { title: "Foo", completed: true });
      server.create("todo", { title: "Bar", completed: false });
    },

    routes() {
      this.timing = timing;
      this.urlPrefix = API_HOST;

      this.get("/todos", (schema) => {
        return schema.todos.all();
      });
    }
  });

  return server;
}
