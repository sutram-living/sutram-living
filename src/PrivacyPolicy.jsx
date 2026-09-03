export default function PrivacyPolicy() {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.7",
        color: "#222",
        background: "#fff",
      }}
    >
      <h1>Privacy Policy</h1>

      <p>
        Welcome to Sutram Living. We respect your privacy and are committed
        to protecting your personal information.
      </p>

      <h2>Information We Collect</h2>

      <p>
        When you use our website or place an order, we may collect information
        such as your name, email address, phone number, delivery address, and
        order details.
      </p>

      <h2>How We Use Your Information</h2>

      <p>
        We use the information collected to process orders, provide customer
        support, communicate with you about your orders, and improve our
        products and services.
      </p>

      <h2>Google Login</h2>

      <p>
        If you choose to sign in using Google, we may receive basic account
        information such as your name, email address, and profile information
        provided by Google. This information is used only for authentication
        and providing website services.
      </p>

      <h2>Payment Information</h2>

      <p>
        Payments are processed through our payment service providers. Sutram
        Living does not store your complete payment card or banking details.
      </p>

      <h2>Information Security</h2>

      <p>
        We take reasonable measures to protect your personal information from
        unauthorized access, misuse, or disclosure.
      </p>

      <h2>Third-Party Services</h2>

      <p>
        Our website may use third-party services such as Google and payment
        providers to provide authentication and payment services.
      </p>

      <h2>Contact Us</h2>

      <p>
        If you have any questions about this Privacy Policy, please contact us
        at:
      </p>

      <p>
        <strong>Email:</strong> siricandles1128@gmail.com
      </p>

      <p>
        <strong>Sutram Living</strong>
      </p>
      <button
        onClick={() => {
          window.history.pushState({}, "", "/shop");
          window.location.reload();
        }}
        style={{
          marginTop: "25px",
          padding: "12px 22px",
          border: "none",
          borderRadius: "10px",
          background: "#222",
          color: "#fff",
          fontSize: "14px",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        ← Back to Shop
      </button>

    </div>
  );
}