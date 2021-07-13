import { FormEvent, useState } from 'react'

import Head from 'next/head'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'

import InputGroup from '../components/InputGroup'

export default function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<any>({})

    const router = useRouter()

    const submitForm = async (event: FormEvent) => {
        event.preventDefault()

        try {
            await axios.post('/auth/login', {
                username,
                password,
            })

            router.push('/')
        } catch (error) {
            console.log(error)
            setErrors(error.response.data)
        }
    }

    return (
        <div className="flex bg-white">
            <Head>
                <title>Login</title>
            </Head>

            <div
                className="h-screen bg-center bg-cover w-36"
                style={{ backgroundImage: "url('/images/bricks.jpeg')" }}
            ></div>
            <div className="flex flex-col justify-center pl-6">
                <div className="w-70">
                    <h1 className="mb-2 text-lg font-medium"> Log In</h1>
                    <p className="mb-10 text-xs">
                        By continuing, you agree to our User Agreement and
                        Privacy Policy.
                    </p>
                    <form onSubmit={submitForm}>
                        <InputGroup
                            className="mb-2"
                            type="text"
                            value={username}
                            setValue={setUsername}
                            placeholder="USERNAME"
                            error={errors.username}
                        />
                        <InputGroup
                            className="mb-4"
                            type="password"
                            value={password}
                            setValue={setPassword}
                            placeholder="PASSWORD"
                            error={errors.password}
                        />

                        <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded">
                            Log In
                        </button>
                    </form>
                    <small>New to Readit?</small>
                    <Link href="/register">
                        <a className="ml-1 text-blue-500 uppercase">Sign Up</a>
                    </Link>
                </div>
            </div>
        </div>
    )
}