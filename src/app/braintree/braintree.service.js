import braintree from 'braintree-web';
@Inject('$http')
export default class BraintreeService {
	constructor() {
		this._apiUrl = 'http://127.0.0.1:3000/api';
		this._tokenPath = '/v1/token';
		this._processPath = '/v1/process';
	}

	get apiUrl() {
		return this._apiUrl
	}

	/**
	 * Get the client token which is generated on the server
	 * @returns {promise}
	 */
	getClientToken() {
		return this.$http.get(this._apiUrl + this._tokenPath);
	}

	/**
	 * Process the payment
	 * @param paymentData
	 * @returns {promise}
	 */
	processPayment(paymentData) {
		return this.$http.post(this._apiUrl + this._processPath, paymentData);
	}

	get $braintree() {
		return braintree;
	}
}