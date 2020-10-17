const getRawBody = require("raw-body");
const Core = require("@alicloud/pop-core");
exports.handler = (req, resp, context) => {
    getRawBody(req, function (err, body) {
        body = JSON.parse(body.toString());
        if (body.token !== "<token>") {
            resp.send('wrong token');
            return;
        }
        console.log(body.path);
        var client = new Core({
            accessKeyId: context.credentials.accessKeyId,
            accessKeySecret: context.credentials.accessKeySecret,
            securityToken: context.credentials.securityToken,
            endpoint: "https://cdn.aliyuncs.com",
            apiVersion: "2018-05-10",
        });
        client
            .request(
                "RefreshObjectCaches",
                {
                    RegionId: "cn-hangzhou",
                    ObjectPath: body.path.join('\r\n'),
                },
                {
                    method: "POST",
                }
            )
            .then(
                (result) => {
                    console.log(JSON.stringify(result));
                    resp.send(JSON.stringify(result, null, "    "));
                },
                (ex) => {
                    console.log(ex);
                    resp.send(JSON.stringify(ex, null, "    "));
                }
            );
    });
};
