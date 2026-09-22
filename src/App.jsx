import { useMemo, useState } from 'react'
import araImg from './damitPic/ara.png'
import b1Img from './damitPic/b1.png'
import c1Img from './damitPic/c1.png'
import c2Img from './damitPic/c2.png'
import car1Img from './damitPic/car1.png'
import supremePoloImg from './damitPic/supreme polo camo.png'
import st2Img from './damitPic/st2.png'
import st3Img from './damitPic/st3.png'
import stuImg from './damitPic/stu.png'
import './App.css'

const products = [
  {
    id: 1,
    name: 'Supreme Arabic tee',
    category: 'T-Shirts',
    price: 350,
    image: araImg,
    description: 'Black graphic t-shirt in good condition.',
  },
  {
    id: 2,
    name: 'Bape polo tee',
    category: 'Polo Shirts',
    price: 300,
    image: b1Img,
    description: 'Simple white polo shirt for casual outfits.',
  },
  {
    id: 3,
    name: 'Chrome Hearts horse shoe logo tee',
    category: 'T-Shirts',
    price: 250,
    image: c1Img,
    description: 'Black t-shirt with a small front logo.',
  },
  {
    id: 4,
    name: 'Chrome Hearts pink horse shoe',
    category: 'T-Shirts',
    price: 320,
    image: c2Img,
    description: 'White t-shirt with a pink back print.',
  },
  {
    id: 5,
    name: 'Carhartt K87',
    category: 'T-Shirts',
    price: 280,
    image: car1Img,
    description: 'Plain black pocket shirt.',
  },
  {
    id: 6,
    name: 'Supreme camo polo',
    category: 'Polo Shirts',
    price: 450,
    image: supremePoloImg,
    description: 'Supreme camo polo shirt.',
  },
  {
    id: 7,
    name: 'Stussy Graphic Tee',
    category: 'T-Shirts',
    price: 420,
    image: st2Img,
    description: 'Black Stussy graphic shirt.',
  },
  {
    id: 8,
    name: 'Dark Graphic Tee',
    category: 'T-Shirts',
    price: 400,
    image: st3Img,
    description: 'Dark shirt with front graphic print.',
  },
  {
    id: 9,
    name: 'Green Logo Tee',
    category: 'T-Shirts',
    price: 450,
    image: stuImg,
    description: 'Black shirt with green front logo.',
  },
]

const categories = ['All', ...new Set(products.map((product) => product.category))]
const productsPerPage = 3
const peso = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
})

function App() {
  const [page, setPage] = useState('home')
  const [selectedProduct, setSelectedProduct] = useState(products[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [cart, setCart] = useState([])
  const [checkout, setCheckout] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    payment: '',
  })
  const [errors, setErrors] = useState({})
  const [orderMessage, setOrderMessage] = useState('')

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  )
  const deliveryFee = cart.length > 0 ? 120 : 0
  const orderTotal = subtotal + deliveryFee

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category
      const query = searchTerm.trim().toLowerCase()
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [category, searchTerm])

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const visibleProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage,
  )

  function navigate(nextPage) {
    setPage(nextPage)
    setOrderMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function showProduct(product) {
    setSelectedProduct(product)
    navigate('details')
  }

  function addToCart(product) {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.product.id === product.id)

      if (existing) {
        return currentCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...currentCart, { product, quantity: 1 }]
    })
  }

  function updateQuantity(productId, quantity) {
    const nextQuantity = Number(quantity)

    if (nextQuantity < 1) {
      return
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: nextQuantity }
          : item,
      ),
    )
  }

  function removeFromCart(productId) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.product.id !== productId),
    )
  }

  function handleCheckoutChange(event) {
    const { name } = event.target
    const value =
      name === 'phone'
        ? event.target.value.replace(/\D/g, '')
        : event.target.value

    setCheckout((currentCheckout) => ({ ...currentCheckout, [name]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
    setOrderMessage('')
  }

  function validateCheckout() {
    const nextErrors = {}

    if (!checkout.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.'
    }

    if (!checkout.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkout.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!checkout.phone.trim()) {
      nextErrors.phone = 'Phone number is required.'
    } else if (!/^\d{7,15}$/.test(checkout.phone)) {
      nextErrors.phone = 'Phone number must contain numbers only.'
    }

    if (!checkout.address.trim()) {
      nextErrors.address = 'Delivery address is required.'
    }

    if (!checkout.payment) {
      nextErrors.payment = 'Choose a payment method.'
    }

    if (cart.length === 0) {
      nextErrors.cart = 'Your cart is empty. Add a product before checkout.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function submitOrder(event) {
    event.preventDefault()

    if (!validateCheckout()) {
      return
    }

    setOrderMessage(
      `Thank you, ${checkout.fullName}! Your order total is ${peso.format(
        orderTotal,
      )}.`,
    )
    setCart([])
    setCheckout({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      payment: '',
    })
    setErrors({})
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="brand" type="button" onClick={() => navigate('home')}>
          Sol Apparel
        </button>

        <nav className="nav-menu" aria-label="Main navigation">
          <button
            className={page === 'home' ? 'active' : ''}
            type="button"
            onClick={() => navigate('home')}
          >
            Home
          </button>
          <button
            className={page === 'cart' ? 'active' : ''}
            type="button"
            onClick={() => navigate('cart')}
          >
            Cart
            <span className="cart-pill">{cartCount}</span>
          </button>
          <button
            className={page === 'checkout' ? 'active' : ''}
            type="button"
            onClick={() => navigate('checkout')}
          >
            Checkout
          </button>
        </nav>
      </header>

      <main>
        {page === 'home' && (
          <HomePage
            addToCart={addToCart}
            category={category}
            filteredProducts={filteredProducts}
            searchTerm={searchTerm}
            setCategory={(nextCategory) => {
              setCategory(nextCategory)
              setCurrentPage(1)
            }}
            setSearchTerm={(nextSearchTerm) => {
              setSearchTerm(nextSearchTerm)
              setCurrentPage(1)
            }}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            showProduct={showProduct}
            totalPages={totalPages}
            visibleProducts={visibleProducts}
          />
        )}

        {page === 'details' && (
          <ProductDetails
            addToCart={addToCart}
            product={selectedProduct}
            goHome={() => navigate('home')}
          />
        )}

        {page === 'cart' && (
          <CartPage
            cart={cart}
            deliveryFee={deliveryFee}
            goCheckout={() => navigate('checkout')}
            goHome={() => navigate('home')}
            orderTotal={orderTotal}
            removeFromCart={removeFromCart}
            subtotal={subtotal}
            updateQuantity={updateQuantity}
          />
        )}

        {page === 'checkout' && (
          <CheckoutPage
            cart={cart}
            checkout={checkout}
            deliveryFee={deliveryFee}
            errors={errors}
            handleCheckoutChange={handleCheckoutChange}
            orderMessage={orderMessage}
            orderTotal={orderTotal}
            submitOrder={submitOrder}
            subtotal={subtotal}
          />
        )}
      </main>
    </div>
  )
}

function HomePage({
  addToCart,
  category,
  currentPage,
  filteredProducts,
  searchTerm,
  setCategory,
  setCurrentPage,
  setSearchTerm,
  showProduct,
  totalPages,
  visibleProducts,
}) {
  return (
    <>
      <section className="hero-section">
        <div>
          <h1>Welcome to Sol Apparel</h1>
          <p className="hero-copy">
            Browse products, add items to your cart, and checkout.
          </p>
        </div>
      </section>

      <section className="toolbar" aria-label="Product search and filter">
        <label>
          Search products
          <input
            type="search"
            placeholder="Search shirt, polo, black..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>

        <label>
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="section-heading">
        <div>
          <h2>Products</h2>
          <p>
            Page {filteredProducts.length === 0 ? 0 : currentPage} of{' '}
            {totalPages || 0}
          </p>
        </div>
      </section>

      {visibleProducts.length > 0 ? (
        <section className="product-grid">
          {visibleProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <button
                className="image-button"
                type="button"
                onClick={() => showProduct(product)}
              >
                <img src={product.image} alt={product.name} />
              </button>
              <div className="product-card-body">
                <span className="category-label">{product.category}</span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-actions">
                  <strong>{peso.format(product.price)}</strong>
                  <button type="button" onClick={() => addToCart(product)}>
                    Add
                  </button>
                </div>
                <button
                  className="link-button"
                  type="button"
                  onClick={() => showProduct(product)}
                >
                  View details
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <p className="empty-state">No products match your search.</p>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              className={currentPage === index + 1 ? 'active-page' : ''}
              key={index + 1}
              type="button"
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  )
}

function ProductDetails({ addToCart, goHome, product }) {
  return (
    <>
      <button className="back-button" type="button" onClick={goHome}>
        Back
      </button>

      <section className="details-layout">
        <div className="details-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="details-content">
          <span className="category-label">{product.category}</span>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <strong className="details-price">{peso.format(product.price)}</strong>
          <button
            className="primary-action"
            type="button"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </section>
    </>
  )
}

function CartPage({
  cart,
  deliveryFee,
  goCheckout,
  goHome,
  orderTotal,
  removeFromCart,
  subtotal,
  updateQuantity,
}) {
  return (
    <section className="cart-layout">
      <div>
        <div className="section-heading">
          <div>
            <h1>Shopping Cart</h1>
            <p>Update quantities, remove items, and review your order total.</p>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="empty-panel">
            <p>Your cart is empty.</p>
            <button type="button" onClick={goHome}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-items">
            {cart.map((item) => (
              <article className="cart-item" key={item.product.id}>
                <img src={item.product.image} alt={item.product.name} />
                <div>
                  <span className="category-label">{item.product.category}</span>
                  <h3>{item.product.name}</h3>
                  <p>{peso.format(item.product.price)}</p>
                </div>
                <label>
                  Qty
                  <input
                    min="1"
                    type="number"
                    value={item.quantity}
                    onChange={(event) =>
                      updateQuantity(item.product.id, event.target.value)
                    }
                  />
                </label>
                <strong>{peso.format(item.product.price * item.quantity)}</strong>
                <button
                  className="ghost-danger"
                  type="button"
                  onClick={() => removeFromCart(item.product.id)}
                >
                  Remove
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

      <OrderSummary
        buttonLabel="Proceed to Checkout"
        buttonDisabled={cart.length === 0}
        deliveryFee={deliveryFee}
        onButtonClick={goCheckout}
        orderTotal={orderTotal}
        subtotal={subtotal}
      />
    </section>
  )
}

function CheckoutPage({
  cart,
  checkout,
  deliveryFee,
  errors,
  handleCheckoutChange,
  orderMessage,
  orderTotal,
  submitOrder,
  subtotal,
}) {
  return (
    <section className="checkout-layout">
      <form className="checkout-form" onSubmit={submitOrder} noValidate>
        <div className="section-heading">
          <div>
            <h1>Checkout</h1>
            <p>Enter your delivery details and choose a payment method.</p>
          </div>
        </div>

        {errors.cart && <p className="form-error">{errors.cart}</p>}
        {orderMessage && <p className="success-message">{orderMessage}</p>}

        <label>
          Full Name
          <input
            name="fullName"
            type="text"
            value={checkout.fullName}
            onChange={handleCheckoutChange}
          />
          {errors.fullName && <span>{errors.fullName}</span>}
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={checkout.email}
            onChange={handleCheckoutChange}
          />
          {errors.email && <span>{errors.email}</span>}
        </label>

        <label>
          Phone Number
          <input
            name="phone"
            inputMode="numeric"
            pattern="[0-9]*"
            type="text"
            value={checkout.phone}
            onChange={handleCheckoutChange}
          />
          {errors.phone && <span>{errors.phone}</span>}
        </label>

        <label>
          Delivery Address
          <textarea
            name="address"
            rows="4"
            value={checkout.address}
            onChange={handleCheckoutChange}
          />
          {errors.address && <span>{errors.address}</span>}
        </label>

        <fieldset>
          <legend>Payment Method</legend>
          <label className="radio-row">
            <input
              checked={checkout.payment === 'Cash on Delivery'}
              name="payment"
              type="radio"
              value="Cash on Delivery"
              onChange={handleCheckoutChange}
            />
            Cash on Delivery
          </label>
          <label className="radio-row">
            <input
              checked={checkout.payment === 'GCash'}
              name="payment"
              type="radio"
              value="GCash"
              onChange={handleCheckoutChange}
            />
            GCash
          </label>
          <label className="radio-row">
            <input
              checked={checkout.payment === 'Credit Card'}
              name="payment"
              type="radio"
              value="Credit Card"
              onChange={handleCheckoutChange}
            />
            Credit Card
          </label>
          {errors.payment && <span>{errors.payment}</span>}
        </fieldset>

        <button className="primary-action" type="submit">
          Place Order
        </button>
      </form>

      <OrderSummary
        buttonLabel={`${cart.length} item${cart.length === 1 ? '' : 's'} in cart`}
        buttonDisabled
        deliveryFee={deliveryFee}
        orderTotal={orderTotal}
        subtotal={subtotal}
      />
    </section>
  )
}

function OrderSummary({
  buttonDisabled,
  buttonLabel,
  deliveryFee,
  onButtonClick,
  orderTotal,
  subtotal,
}) {
  return (
    <aside className="order-summary">
      <h2>Order Summary</h2>
      <div>
        <span>Subtotal</span>
        <strong>{peso.format(subtotal)}</strong>
      </div>
      <div>
        <span>Delivery</span>
        <strong>{peso.format(deliveryFee)}</strong>
      </div>
      <div className="summary-total">
        <span>Total</span>
        <strong>{peso.format(orderTotal)}</strong>
      </div>
      <button disabled={buttonDisabled} type="button" onClick={onButtonClick}>
        {buttonLabel}
      </button>
    </aside>
  )
}

export default App
