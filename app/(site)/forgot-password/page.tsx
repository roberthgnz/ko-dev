import { ForgotPasswordForm } from "./forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <div className="container relative">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Reestablecer contraseña
          </h1>
          <p className="text-sm text-muted-foreground">
            Ingrese su correo electrónico a continuación para reestablecer su
            contraseña.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
