// ../../../private/var/folders/hk/22yptg516rq58thxt21p_6j80000gn/T/bunx-501-wrangler@latest/node_modules/wrangler/templates/no-op-worker.js
var no_op_worker_default = {
  fetch() {
    return new Response("Not found", {
      status: 404,
      headers: {
        "Content-Type": "text/html"
      }
    });
  }
};
export {
  no_op_worker_default as default
};
//# sourceMappingURL=no-op-worker.js.map
