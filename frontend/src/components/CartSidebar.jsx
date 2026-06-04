import { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { X, Trash2, CreditCard, CheckCircle, Truck, ShieldCheck, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function CartSidebar() {
  const { cartItems, isCartOpen, toggleCart, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'shipping', 'payment', 'success'
  const [shippingForm, setShippingForm] = useState({ name: '', phone: '', address: '', pincode: '' });
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card'
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatusMessage, setPaymentStatusMessage] = useState('');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    if (user && checkoutStep === 'shipping') {
      let parsedAddress = { street: '', city: '', state: '', pincode: '', landmark: '', type: '' };
      try {
        if (user.shipping_address && user.shipping_address.startsWith('{')) {
          parsedAddress = JSON.parse(user.shipping_address);
        } else if (user.shipping_address) {
          parsedAddress.street = user.shipping_address;
        }
      } catch (e) {
        parsedAddress.street = user.shipping_address || '';
      }
      
      const combinedAddr = [
        parsedAddress.street,
        parsedAddress.landmark ? `Landmark: ${parsedAddress.landmark}` : null,
        parsedAddress.city,
        parsedAddress.state
      ].filter(Boolean).join(', ');

      setShippingForm({
        name: user.name || '',
        phone: user.phone || '',
        address: combinedAddr,
        pincode: parsedAddress.pincode || ''
      });
    }
  }, [user, checkoutStep]);

  // Pincode auto location detection for checkout
  useEffect(() => {
    const fetchCheckoutLocation = async () => {
      const pin = shippingForm.pincode ? shippingForm.pincode.toString().trim() : '';
      if (pin.length === 6 && /^\d+$/.test(pin)) {
        try {
          const res = await axios.get(`https://api.postalpincode.in/pincode/${pin}`);
          if (res.data && res.data[0] && res.data[0].Status === "Success") {
            const postOffices = res.data[0].PostOffice;
            if (postOffices && postOffices.length > 0) {
              const info = postOffices[0];
              const detectedCity = info.District || "";
              const detectedState = info.State || "";
              
              setShippingForm(prev => {
                const cityStateStr = `${detectedCity}, ${detectedState}`;
                if (prev.address.includes(detectedCity)) {
                  return prev;
                }
                const newAddress = prev.address 
                  ? `${prev.address.trim()}, ${cityStateStr}` 
                  : cityStateStr;
                return { ...prev, address: newAddress };
              });
            }
          }
        } catch (e) {
          console.error("Error fetching pincode in checkout", e);
        }
      }
    };
    fetchCheckoutLocation();
  }, [shippingForm.pincode]);

  if (!isCartOpen) return null;

  const total = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const handleClearCart = async () => {
    // Sequentially clear items in cart
    for (const item of cartItems) {
      await removeFromCart(item.id);
    }
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!shippingForm.name || !shippingForm.phone || !shippingForm.address || !shippingForm.pincode) {
      alert("Please fill all shipping fields.");
      return;
    }
    setCheckoutStep('payment');
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (paymentMethod === 'upi' && !upiId) {
      alert("Please enter your UPI ID.");
      return;
    }
    if (paymentMethod === 'card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)) {
      alert("Please enter mock card details.");
      return;
    }

    setIsProcessingPayment(true);
    
    // Animate payment processing phases for premium feel
    const stages = [
      "Securing connection...",
      "Verifying credentials...",
      "Requesting transfer from bank...",
      "Confirming signature..."
    ];

    for (let i = 0; i < stages.length; i++) {
      setPaymentStatusMessage(stages[i]);
      await new Promise(res => setTimeout(res, 800));
    }

    // Success state
    if (user) {
      try {
        const addressStr = `${shippingForm.name}, Phone: ${shippingForm.phone}, Address: ${shippingForm.address}, PIN: ${shippingForm.pincode}`;
        const res = await axios.post('http://127.0.0.1:8000/api/orders/', {
          user_id: user.id,
          shipping_address: addressStr
        });
        setOrderId(`AVR-00${res.data.id}`);
      } catch (err) {
        console.error("Error creating database order", err);
        setOrderId('AVR-' + Math.floor(100000 + Math.random() * 900000));
      }
    } else {
      setOrderId('AVR-' + Math.floor(100000 + Math.random() * 900000));
    }
    
    setIsProcessingPayment(false);
    setCheckoutStep('success');
    await handleClearCart();

  };

  const handleCloseAndReset = () => {
    setCheckoutStep('cart');
    setShippingForm({ name: '', phone: '', address: '', pincode: '' });
    setUpiId('');
    setCardDetails({ number: '', expiry: '', cvv: '' });
    toggleCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={handleCloseAndReset}></div>
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-2xl border-l border-pink-100 overflow-hidden">
            
            {/* Header */}
            <div className="py-6 px-4 sm:px-6 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {checkoutStep !== 'cart' && checkoutStep !== 'success' && (
                  <button 
                    onClick={() => setCheckoutStep(checkoutStep === 'payment' ? 'shipping' : 'cart')}
                    className="p-1 hover:bg-pink-100 rounded-full text-pink-600 transition-colors mr-1"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <h2 className="text-lg font-bold text-gray-900">
                  {checkoutStep === 'cart' && "Shopping Cart"}
                  {checkoutStep === 'shipping' && "Shipping Details"}
                  {checkoutStep === 'payment' && "Secure Checkout"}
                  {checkoutStep === 'success' && "Order Placed!"}
                </h2>
              </div>
              <button onClick={handleCloseAndReset} className="p-1.5 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
              
              {/* STEP 1: CART LISTING */}
              {checkoutStep === 'cart' && (
                <>
                  {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20">
                      <div className="text-6xl mb-4">🛍️</div>
                      <h3 className="text-lg font-bold text-gray-900">Your cart is empty</h3>
                      <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
                        Explore our collections and add products to your wardrobe.
                      </p>
                      <button 
                        onClick={toggleCart} 
                        className="mt-6 px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-semibold shadow-md transition-colors"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="flow-root">
                      <ul role="list" className="-my-6 divide-y divide-gray-200">
                        {cartItems.map((item) => (
                          <li key={item.id} className="py-6 flex">
                            <div className="flex-shrink-0 w-20 h-24 border border-pink-100 rounded-xl overflow-hidden shadow-sm">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-full h-full object-center object-cover"
                              />
                            </div>

                            <div className="ml-4 flex-1 flex flex-col">
                              <div>
                                <div className="flex justify-between text-sm font-semibold text-gray-900">
                                  <h3 className="truncate max-w-[200px] hover:text-pink-600 transition-colors">
                                    <Link to={`/product/${item.product.id}`} onClick={toggleCart}>{item.product.name}</Link>
                                  </h3>
                                  <p className="ml-4 text-pink-600 font-bold">₹{Number(item.product.price).toLocaleString('en-IN')}</p>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">{item.product.brand}</p>
                              </div>
                              <div className="flex-1 flex items-end justify-between text-xs">
                                <div className="flex gap-1.5">
                                  <span className="bg-pink-50 text-pink-700 px-2 py-0.5 rounded-full font-medium">Size: {item.size || "M"}</span>
                                  <span className="bg-pink-50 text-pink-700 px-2 py-0.5 rounded-full font-medium">Qty {item.quantity}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.id)}
                                  className="font-semibold text-red-500 hover:text-red-700 flex items-center transition-colors gap-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Remove
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {/* STEP 2: SHIPPING FORM */}
              {checkoutStep === 'shipping' && (
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 flex items-center gap-3 mb-6">
                    <Truck className="w-6 h-6 text-pink-600 shrink-0" />
                    <p className="text-xs text-gray-600">
                      Standard home delivery is free across India. Delivery usually takes 3-5 business days.
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Devendra Kumar"
                      value={shippingForm.name}
                      onChange={e => setShippingForm({...shippingForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone Number</label>
                    <input
                      required
                      type="tel"
                      placeholder="e.g. +91 9876543210"
                      value={shippingForm.phone}
                      onChange={e => setShippingForm({...shippingForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Delivery Address</label>
                    <textarea
                      required
                      rows="3"
                      placeholder="Street address, colony, landmark..."
                      value={shippingForm.address}
                      onChange={e => setShippingForm({...shippingForm, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Pincode</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. 700001"
                      value={shippingForm.pincode}
                      onChange={e => setShippingForm({...shippingForm, pincode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <button type="submit" className="hidden" id="shipping-submit-btn" />
                </form>
              )}

              {/* STEP 3: PAYMENT & PROCESSING */}
              {checkoutStep === 'payment' && (
                <div className="space-y-6">
                  {isProcessingPayment ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20">
                      <Loader2 className="w-10 h-10 text-pink-600 animate-spin mb-4" />
                      <h3 className="text-lg font-bold text-gray-900">Processing Payment</h3>
                      <p className="text-xs text-pink-600 font-semibold mt-2 tracking-wide uppercase">{paymentStatusMessage}</p>
                      <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5 justify-center">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" /> Safe & Secured 256-bit SSL Connection
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handlePaymentSubmit} className="space-y-6">
                      <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-pink-600 shrink-0" />
                        <p className="text-xs text-gray-600 font-medium">
                          Secure payment simulation. No actual funds will be charged.
                        </p>
                      </div>

                      {/* Payment Mode Selector */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('upi')}
                          className={`py-3 px-4 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all ${
                            paymentMethod === 'upi'
                              ? "bg-pink-600 border-pink-600 text-white shadow-md"
                              : "bg-white border-gray-200 text-gray-600 hover:border-pink-300"
                          }`}
                        >
                          <span className="text-lg">✨</span>
                          UPI Payment (Simulated)
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className={`py-3 px-4 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all ${
                            paymentMethod === 'card'
                              ? "bg-pink-600 border-pink-600 text-white shadow-md"
                              : "bg-white border-gray-200 text-gray-600 hover:border-pink-300"
                          }`}
                        >
                          <CreditCard className="w-5 h-5" />
                          Credit/Debit Card
                        </button>
                      </div>

                      {/* Payment Inputs */}
                      {paymentMethod === 'upi' ? (
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">UPI ID</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. devendra@upi"
                            value={upiId}
                            onChange={e => setUpiId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                          />
                          <p className="text-[10px] text-gray-400">Accepts formats like @upi, @okaxis, @ybl etc.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Card Number</label>
                            <input
                              required
                              type="text"
                              maxLength="16"
                              placeholder="4111 2222 3333 4444"
                              value={cardDetails.number}
                              onChange={e => setCardDetails({...cardDetails, number: e.target.value.replace(/\D/g, '')})}
                              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Expiry Date</label>
                              <input
                                required
                                type="text"
                                maxLength="5"
                                placeholder="MM/YY"
                                value={cardDetails.expiry}
                                onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">CVV</label>
                              <input
                                required
                                type="password"
                                maxLength="3"
                                placeholder="***"
                                value={cardDetails.cvv}
                                onChange={e => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '')})}
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      <button type="submit" className="hidden" id="payment-submit-btn" />
                    </form>
                  )}
                </div>
              )}

              {/* STEP 4: ORDER SUCCESS */}
              {checkoutStep === 'success' && (
                <div className="h-full flex flex-col items-center justify-center text-center py-10 px-4">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 shadow-md shadow-emerald-100/50">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900">Jai Hind! 🎉</h3>
                  <h4 className="text-lg font-bold text-gray-800 mt-1">Order Placed Successfully!</h4>
                  
                  <div className="mt-6 bg-pink-50/50 rounded-2xl p-4 border border-pink-100 text-left w-full space-y-2.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 uppercase tracking-wider">Order ID</span>
                      <span className="font-bold text-gray-900">{orderId}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 uppercase tracking-wider">Customer Name</span>
                      <span className="font-medium text-gray-800">{shippingForm.name}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 uppercase tracking-wider">Delivery Pincode</span>
                      <span className="font-medium text-gray-800">{shippingForm.pincode}</span>
                    </div>
                    <hr className="border-pink-100" />
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-gray-800">Total Paid</span>
                      <span className="text-pink-600">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-6 leading-relaxed">
                    Thank you for shopping at Aavriti.in. A confirmation email and tracking link will be sent to you shortly.
                  </p>

                  <button
                    onClick={handleCloseAndReset}
                    className="mt-8 w-full py-3.5 rounded-xl font-bold bg-pink-600 hover:bg-pink-700 text-white shadow-lg transition-colors"
                  >
                    Back to Store
                  </button>
                </div>
              )}

            </div>

            {/* Footer Summary / Action CTA */}
            {cartItems.length > 0 && checkoutStep !== 'success' && (
              <div className="border-t border-pink-100 py-6 px-4 sm:px-6 bg-gradient-to-b from-white to-pink-50/20">
                <div className="flex justify-between text-base font-semibold text-gray-900">
                  <p>Subtotal</p>
                  <p className="text-pink-600 font-extrabold text-lg">₹{total.toLocaleString('en-IN')}</p>
                </div>
                <p className="mt-1 text-xs text-gray-400">Shipping, GST, and packaging charges are computed at checkout.</p>
                
                <div className="mt-5">
                  {checkoutStep === 'cart' && (
                    <button
                      onClick={() => setCheckoutStep('shipping')}
                      className="w-full flex justify-center items-center px-6 py-3.5 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-95 transition-all shadow-pink-200"
                    >
                      Proceed to Checkout
                    </button>
                  )}

                  {checkoutStep === 'shipping' && (
                    <button
                      onClick={() => document.getElementById('shipping-submit-btn')?.click()}
                      className="w-full flex justify-center items-center px-6 py-3.5 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-95 transition-all shadow-pink-200"
                    >
                      Deliver to this Address
                    </button>
                  )}

                  {checkoutStep === 'payment' && !isProcessingPayment && (
                    <button
                      onClick={() => document.getElementById('payment-submit-btn')?.click()}
                      className="w-full flex justify-center items-center px-6 py-3.5 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-95 transition-all shadow-pink-200"
                    >
                      Pay ₹{total.toLocaleString('en-IN')} Simulating Payment
                    </button>
                  )}
                </div>

                {checkoutStep === 'cart' && (
                  <div className="mt-4 flex justify-center text-xs text-center text-gray-500">
                    <p>
                      or{' '}
                      <button
                        type="button"
                        className="text-pink-600 font-bold hover:text-pink-500 transition-colors"
                        onClick={toggleCart}
                      >
                        Continue Shopping &rarr;
                      </button>
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
