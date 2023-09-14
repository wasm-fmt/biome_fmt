import init, { format } from "../pkg/rome_fmt.js";

import { assertEquals } from "https://deno.land/std@0.200.0/assert/mod.ts";
import { walk } from "https://deno.land/std@0.200.0/fs/walk.ts";
import { relative } from "https://deno.land/std@0.200.0/path/mod.ts";

await init();

const update = Deno.args.includes("--update");

const test_root = new URL("../test_data", import.meta.url);

for await (const entry of walk(test_root, {
	includeDirs: false,
	exts: ["js", "jsx", "ts", "tsx"],
})) {
	const input = Deno.readTextFileSync(entry.path);
	const expected = Deno.readTextFileSync(entry.path + ".snap");

	const actual = format(input, entry.name);

	if (update) {
		Deno.writeTextFileSync(entry.path + ".snap", actual);
	} else {
		const test_name = relative(test_root.pathname, entry.path);

		Deno.test(test_name, () => {
			assertEquals(actual, expected);
		});
	}
}