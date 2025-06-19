'use strict'

class FetchWithRetry {
	// Retry API Carefully

	//Level 0
	static fetchWithRetryLevel0 = async (url = ``) => {
		if (!url) throw new BadRequestError('URL is required')
		const response = await fetch(url);
		return response;
	}

	// Level 1
	static fetchWithRetryLevel1 = async (url = ``) => {
		if (!url) throw new BadRequestError('URL is required')
		const response = await fetch(url);
		if (response.status < 200 || response.status >= 300) {
			await this.fetchWithRetryLevel1(url); // Retry
		}

		return response;
	}

	// Level 2
	static fetchWithRetryLevel2 = async (url = ``) => {
		if (!url) throw new BadRequestError('URL is required')
		const response = await fetch(url);
		if (response.status < 200 || response.status >= 300) {
			setTimeout(async() => {
				await this.fetchWithRetryLevel2(url); // Retry
			}, 3000);
		}

		return response;
	}

	// Level 3
	// 30000 users, backoff
	static fetchWithRetryLevel3 = async (url = ``, errorCount = 0) => {
		if (!url) throw new BadRequestError('URL is required')

		const ERROR_COUNT_MAX = 3;

		const response = await fetch(url);
		if (response.status < 200 || response.status >= 300) {
			if (errorCount > ERROR_COUNT_MAX) {
				setTimeout(async() => {
					await this.fetchWithRetryLevel3(url, errorCount+1); // Retry
				}, errorCount * 3000);
			}
		}

		return response;
	}

	// Level > 3
	// 30000 users, backoff
	static fetchWithRetryLevel4 = async (url = ``, errorCount = 0) => {
		if (!url) throw new BadRequestError('URL is required')

		const ERROR_COUNT_MAX = 3;

		const response = await fetch(url);
		if (response.status < 200 || response.status >= 300) {
			if (errorCount > ERROR_COUNT_MAX) {
				setTimeout(async() => {
					await this.fetchWithRetryLevel4(url, errorCount+1); // Retry
				}, errorCount * 3000 + Math.random() * 1000); // Random delay, tránh đồng thời cao
			}
		}

		return response;
	}
}
