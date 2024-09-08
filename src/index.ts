/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

async function expiringShares(){
	const expireShares = await fetch('https://beta.moveto.kr/api/admin/storage')
	const result = await expireShares.json()
	return {expireShares, result}
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const {expireShares, result} = await expiringShares()

		if(expireShares.ok){
			return new Response(JSON.stringify(result), { status: 200 })
		}else{
			return new Response(JSON.stringify(result), { status: 500 })
		}
	},

	async scheduled(
		controller: ScheduledController,
		env: Env,
		ctx: ExecutionContext,
	) {
		await expiringShares()
	},
} satisfies ExportedHandler<Env>;
