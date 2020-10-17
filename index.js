const getRawBody = require("raw-body");
const Core = require("@alicloud/pop-core");
exports.handler = (req, resp, context) => {
  getRawBody(req, function (err, body) {
    body = JSON.parse(body.toString());
    if (body.token !== "<token>") {
      resp.send("wrong token");
      return;
    }
    const client = new Core({
      accessKeyId: context.credentials.accessKeyId,
      accessKeySecret: context.credentials.accessKeySecret,
      securityToken: context.credentials.securityToken,
      endpoint: "https://cdn.aliyuncs.com",
      apiVersion: "2018-05-10",
    });
    if (body.action == "purge") {
      console.log(
        `purge ${body.isFolder ? "Directory" : "File"} path:${body.path.join(
          "\r\n"
        )}`
      );
      client
        .request(
          "RefreshObjectCaches",
          {
            RegionId: "cn-hangzhou",
            ObjectPath: body.path.join("\r\n"),
            ObjectType: body.isFolder ? "Directory" : "File",
          },
          {
            method: "POST",
          }
        )
        .then(
          (result) => {
            console.log(JSON.stringify(result));
            resp.send(JSON.stringify(result, null, "  "));
          },
          (ex) => {
            console.log(ex);
            resp.send(JSON.stringify(ex, null, "  "));
          }
        );
    }
    if (body.action == "Quota") {
      console.log(`quota`);
      client
        .request(
          "DescribeRefreshQuota",
          {
            RegionId: "cn-hangzhou",
          },
          {
            method: "POST",
          }
        )
        .then(
          (result) => {
            console.log(JSON.stringify(result));
            resp.send(JSON.stringify(result, null, "  "));
          },
          (ex) => {
            console.log(ex);
            resp.send(JSON.stringify(ex, null, "  "));
          }
        );
    }
    if (body.action == "Tasks") {
      console.log(`tasks`);
      client
        .request(
          "DescribeRefreshTasks",
          {
            RegionId: "cn-hangzhou",
            ResourceGroupId: " rg-aek2mcogz6aphiy",
          },
          {
            method: "POST",
          }
        )
        .then(
          (result) => {
            console.log(JSON.stringify(result));
            resp.send(JSON.stringify(result, null, "  "));
          },
          (ex) => {
            console.log(ex);
            resp.send(JSON.stringify(ex, null, "  "));
          }
        );
    }
  });
};
