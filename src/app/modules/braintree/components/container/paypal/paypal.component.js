import template from './paypal.html';
import {ROUTES} from '../../../braintree.constants';

// Inject dependencies
@Inject('braintreeService')
class PaypalComponent {
	constructor() {
		this._checkout = null;
		this.state = {
			loading: false,
			nextRoute: ''
		};
	}

	// Private methods
	// --------------------------------------------------
	$onInit() {
		console.log('customer', this.braintreeService.customer);

		if(!this.braintreeService.customer.clientToken) {
			this.braintreeService.getClientToken().then(
				(response) => {
					let customer = {
						clientToken: response.data.client_token
					};
					this.braintreeService.updateCustomerModel(customer);
					this._setupPaypal(customer.clientToken);
				}
			);
		} else {
			this._setupPaypal(this.braintreeService.customer.clientToken);
		}
	}

	_setupPaypal(clientToken) {
		this.braintreeService.$braintree.setup(clientToken, "custom", {
			paypal: {
				// currency: 'USD',
				// locale: 'en_us',
				enableShippingAddress: true,
				headless: true
			},
			onReady: (integration) => {
				console.log('Paypal is ready');
				this._checkout = integration;
			},
			onAuthorizationDismissed: (obj) => {
				console.log('onAuthorizationDismissed', obj);
			},
			onPaymentMethodReceived: (obj) => {
				this._createPaymentOption(obj);
			}
		});
	}

	_createPaymentOption(paymentMethod) {
		console.log('onPaymentMethodReceived', paymentMethod);
		let paymentMethodModel = {
			customerId: this.braintreeService.customer.id,
			paymentMethodNonce: paymentMethod.nonce
		};

		console.log('paymentMethodModel:', paymentMethodModel);

		this.braintreeService.createPaymentMethod(paymentMethodModel).then(
			(response) => {
				this.braintreeService.updateCustomerModel(response.data.customer);

				this.state.nextRoute = ROUTES.SUBSCRIPTION_OVERVIEW;
				this.$router.navigate([this.state.nextRoute]);
				console.log('Paypal Payment method created!', response);
			},
			(error) => {
				this.message = 'Failed to create payment method:' + error.data.message;
				console.log('Failed to create payment method:', error);
			}
		);
	}

	pay(event) {
		this._checkout.paypal.initAuthFlow();
	}

	// Public viewModel methods
	// --------------------------------------------------
}

// Component decorations
let component = {
	bindings: {
		$router: '<'
	},
	template : template,
	controller: PaypalComponent
};

export default component;
