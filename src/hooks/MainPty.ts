import { ref, computed, onMounted, onUnmounted } from "vue"

const useReplyMessage = (type: string) => {
	const content = ref("");

	const setReplyMessage = (message: string) => {
		content.value = message
	}

	const appendReplyMessage = (message: string) => {
		content.value += message
	}

	const replyMessage = computed(() => {
		let result = ""
		switch (type) {
			case "getImages":
				const splitContent = content.value.split("\n")
				result = `[${splitContent.slice(1, splitContent.length - 1).join(",")}]`
				break
			default:
				break
		}
		return result
	})

	return {
		setReplyMessage,
		appendReplyMessage,
		replyMessage
	}
}

const useListener = (channel: string, callback: (e: callbackEvent) => void) => {
	const w = (window as any);

	onMounted(() => {
		w.process.listen(channel, callback)
	})

	onUnmounted(() => {
		w.process.listenOff(channel)
	})
}

export interface callbackEvent {
	data: string;
	originMessage: {
		type: string;
		method: string;
		[key: string]: string;
	}
}

export {
	useReplyMessage,
	useListener
}