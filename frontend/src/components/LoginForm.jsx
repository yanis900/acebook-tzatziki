
export function LoginForm(props) {
    return (
        <form onSubmit={props.handleSubmit} className="fieldset">
       <h2 className="text-lg">Welcome Back</h2>

        <label htmlFor="email" className="label">Email:</label>
        <input
          placeholder="Enter Your Email"
          id="email"
          type="text"
          value={props.email}
          onChange={props.handleEmailChange}
          required
          className="input"
        />
        <label htmlFor="password" className="label">Password:</label>
        <input
          placeholder="Enter Your Password"
          id="password"
          type="password"
          value={props.password}
          onChange={props.handlePasswordChange}
          required
          className="input"
        />
        <input role="submit-button" id="submit" type="submit" value="Submit" className="btn" />
      </form>
    )
}