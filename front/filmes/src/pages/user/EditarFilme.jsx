import React from "react"

import GiraGira from "../../components/GiraGira/GiraGira"
import NavBar from "../../components/NavBar/NavBar"
import Footer from "../../components/Footer/Footer"

import '../../index.css'

export default function EditarFilme(){
    return(
        <main className="mainPadrao">
            <GiraGira />
            <div className="formatacao">
                <NavBar />

                <Footer />
            </div>

        </main>
    )
}