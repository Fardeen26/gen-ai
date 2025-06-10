"use client"

import axios from "axios"
import { useState } from "react"

export default function SearchCard() {
    const [query, setQuery] = useState('')

    const handleSubmit = async () => {
        try {
            const response = await axios.post('/api/query', { query })

            console.log("data is here", response.data)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <section className="flex flex-col">
            <p>get card data</p>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />

            <button onClick={handleSubmit}>search</button>
        </section>
    )
}