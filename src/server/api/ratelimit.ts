import { Ratelimit } from "@unkey/ratelimit"
import {env} from "../../env"

const unkey = new Ratelimit({
    rootKey: env.UNKEY_ROOT_KEY,
    namespace: "example-app",
    limit: 10,
    duration: "30s",
    async: true
})

export default unkey;
