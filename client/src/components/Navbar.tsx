import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { Fragment, useEffect, useState } from 'react'
import { useAuthState, useAuthDispatch } from '../context/auth'

import RedditLogo from '../images/reddit.svg'
import { Sub } from '../types'
import { useRouter } from 'next/router'

const Navbar: React.FC = () => {
    const [name, setName] = useState('')
    const [subs, setSubs] = useState<Sub[]>([])
    const [timer, setTimer] = useState(null)

    const { authenticated, loading } = useAuthState()
    const dispatch = useAuthDispatch()

    const router = useRouter()

    const logout = () => {
        axios
            .get('/auth/logout')
            .then(() => {
                dispatch('LOGOUT')
                window.location.reload()
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        if (name.trim() === '') {
            setSubs([])
            return
        }

        // Do the search
        searchSubs()
    }, [name])

    const searchSubs = async () => {
        clearTimeout(timer)
        setTimer(
            setTimeout(async () => {
                try {
                    const { data } = await axios.get(`/subs/search/${name}`)

                    setSubs(data)
                } catch (error) {
                    console.log(error)
                }
            }, 250)
        )
    }

    const goToSub = (subName: string) => {
        router.push(`/r/${subName}`)
        setName('')
    }

    return (
        <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white">
            {/* Logo and title */}
            <div className="flex items-center">
                <Link href="/">
                    <a>
                        <RedditLogo className="w-8 h-8 mr-2" />
                    </a>
                </Link>
                <span className="text-2xl font-semibold">
                    <Link href="/">readit</Link>
                </span>
            </div>
            {/* Search Input */}
            <div className="relative flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
                <i className="pl-4 pr-3 text-gray-500 bg-transparent fas fa-search "></i>
                <input
                    type="text"
                    className="py-1 pr-3 rounded w-160 focus:outline-none"
                    placeholder="Search"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div
                    className="absolute left-0 right-0 bg-white"
                    style={{ top: '100%' }}
                >
                    {subs?.map((sub) => (
                        <div
                            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200"
                            onClick={() => goToSub(sub.name)}
                        >
                            <Image
                                src={sub.imageUrl}
                                className="rounded-full"
                                alt="Sub"
                                height={(8 * 16) / 4}
                                width={(8 * 16) / 4}
                            />
                            <div className="text-sm ml-4">
                                <p className="font-medium">{sub.name}</p>
                                <p className="text-gray-600">{sub.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Auth Buttons */}
            <div className="flex">
                {!loading &&
                    (authenticated ? (
                        // Log out button
                        <button
                            className="w-32 py-1 mr-4 leading-5 hollow blue button"
                            onClick={logout}
                        >
                            log out
                        </button>
                    ) : (
                        <Fragment>
                            <Link href="/login">
                                <a className="w-32 py-1 mr-4 leading-5 hollow blue button">
                                    log in
                                </a>
                            </Link>
                            <Link href="/register">
                                <a className="w-32 py-1 leading-5 blue button">
                                    sign up
                                </a>
                            </Link>
                        </Fragment>
                    ))}
            </div>
        </div>
    )
}

export default Navbar
