import template from './payment-methods.html';
import {ROUTES} from '../../../braintree.constants';

// Inject dependencies
@Inject('braintreeService')
class PaymentMethodsComponent {
	constructor() {
		// Used in template
		this.routes = {
			subscription: ROUTES.SUBSCRIPTION
		};

		this.customer = null;
	}

	// Private methods
	// --------------------------------------------------
	$onInit() {
		this.customer = this.braintreeService.customer;
	}

	// Public viewModel methods
	// --------------------------------------------------
	choosePaymentMethod(method) {
		if(method === 'cards') {
			this.$router.navigate([ROUTES.CARDS]);
		} else if(method === 'paypal') {
			this.$router.navigate([ROUTES.PAYPAL]);
		}
	}
}

// Component decorations
let component = {
	bindings: {
		$router: '<'
	},
	template : template,
	controller: PaymentMethodsComponent
};

export default component;
