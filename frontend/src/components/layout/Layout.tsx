import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Styles from '../../styles/layout/Layout.module.css';

type Props = {
    children?: React.ReactNode
}

const Layout: React.FC<Props> = (props) => {

    return (
        <>
            <div style={{height:'100%'}}>
                <Header />
                <main className={Styles.main}>
                    {props.children}
                </main>
                <Footer />
            </div>
        </>
    )
}

export default Layout;