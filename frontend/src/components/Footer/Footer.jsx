import { Grid } from 'antd'
import { TwitterOutlined, FacebookOutlined, InstagramOutlined, YoutubeOutlined, PinterestOutlined } from '@ant-design/icons'
import './Footer.css'

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer__col">
                <h3 className="col__header">SWOO-1ST NYC TECH ONLINE MARKET</h3>
                <div className="contact">
                    <div className="contact__hotline">
                        <small>HOTLINE 24/7</small>
                        <h2>(025) 3686 25 16</h2>
                    </div>
                    <div className="contact__location">
                        <p>257 Thatcher Road St, Brooklyn, Manhattan, 
                            <p>NYC 10092</p>
                        </p>
                    </div>
                    <div className="media">
                    <div className="media__icon twitter">
                        <TwitterOutlined/>
                    </div>
                    <div className="media__icon facebook">
                        <FacebookOutlined />
                    </div>
                    <div className="media__icon instagram">
                        <InstagramOutlined/>
                    </div>
                    <div className="media__icon youtube">
                        <YoutubeOutlined/>
                    </div>
                    <div className="media__icon">
                        <PinterestOutlined/>
                    </div>
                </div>
                </div>
            </div>
            <div className="footer__col">
                <h3 className="col__header">TOP CATEGORIES</h3>
                <ul className='categories'>
                    <li className='categorty'>Laptops</li>
                    <li className='categorty'>PC & Computers</li>
                    <li className='categorty'>Cellphones</li>
                    <li className='categorty'>Tablets</li>
                    <li className='categorty'>Gaming & VR</li>
                    <li className='categorty'>Network</li>
                    <li className='categorty'>Cameras</li>
                    <li className='categorty'>Sounds</li>
                </ul>
            </div>
            <div className="footer__col">
                <h3 className="col__header">COMPANY</h3>
                <ul className='categories'>
                    <li className='categorty'>Laptops</li>
                    <li className='categorty'>PC & Computers</li>
                    <li className='categorty'>Cellphones</li>
                    <li className='categorty'>Tablets</li>
                    <li className='categorty'>Gaming & VR</li>
                    <li className='categorty'>Network</li>
                    <li className='categorty'>Cameras</li>
                    <li className='categorty'>Sounds</li>
                </ul>
            </div>
            <div className="footer__col">
                <h3 className="col__header">HELP CENTER</h3>
                <ul className='categories'>
                    <li className='categorty'>Laptops</li>
                    <li className='categorty'>PC & Computers</li>
                    <li className='categorty'>Cellphones</li>
                    <li className='categorty'>Tablets</li>
                    <li className='categorty'>Gaming & VR</li>
                    <li className='categorty'>Network</li>
                    <li className='categorty'>Cameras</li>
                    <li className='categorty'>Sounds</li>
                </ul>
            </div>
            <div className="footer__col">
                <h3 className="col__header">PARTNER</h3>
                <ul className='categories'>
                    <li className='categorty'>Laptops</li>
                    <li className='categorty'>PC & Computers</li>
                    <li className='categorty'>Cellphones</li>
                    <li className='categorty'>Tablets</li>
                    <li className='categorty'>Gaming & VR</li>
                    <li className='categorty'>Network</li>
                    <li className='categorty'>Cameras</li>
                    <li className='categorty'>Sounds</li>
                </ul>
            </div>
        </div>
    )
}

export default Footer