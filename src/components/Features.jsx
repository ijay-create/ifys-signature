import React from 'react';
import { motion } from 'framer-motion';
import {
  ChefHat,
  Leaf,
  Star,
  UsersRound
} from 'lucide-react';

import '../styles/Features.css';

const features = [
  {
    icon: Leaf,
    number: '01',
    title: 'Fresh Ingredients',
    text:
      'We use carefully selected, fresh ingredients to create fried rice that is colorful, aromatic, and full of natural flavor in every bite.'
  },
  {
    icon: ChefHat,
    number: '02',
    title: 'Homemade with Love',
    text:
      'Every pan is prepared from scratch with care, attention to detail, and the comforting homemade taste that makes every meal feel special.'
  },
  {
    icon: UsersRound,
    number: '03',
    title: 'Perfect for Any Occasion',
    text:
      'Whether it is a family dinner, birthday celebration, corporate gathering, wedding, or special event, we make sharing great food easy.'
  },
  {
    icon: Star,
    number: '04',
    title: 'Made Your Way',
    text:
      'Build your perfect meal by choosing your pan size, favorite protein, and preferred spice level for a fried rice experience made just for you.'
  }
];

const Features = () => (
  <section className="features">
    <div className="features-header">
      <span className="features-eyebrow">
        WHY CHOOSE IFY'S
      </span>

      <h2>
        More Than Just
        <span> Fried Rice</span>
      </h2>

      <p>
        From the ingredients we choose to the way every pan is prepared,
        we put care into every detail so you can enjoy food that tastes
        homemade, feels personal, and brings people together.
      </p>
    </div>

    <div className="features-grid">
      {features.map(
        ({ icon: Icon, number, title, text }, index) => (
          <motion.article
            className="feature-card"
            key={title}
            initial={{
              opacity: 0,
              y: 45
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true,
              amount: 0.2
            }}
            transition={{
              duration: 0.65,
              delay: index * 0.12,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <div className="feature-top">
              <span className="feature-number">
                {number}
              </span>

              <div className="feature-icon-wrap">
                <Icon
                  className="feature-icon"
                  size={32}
                  strokeWidth={1.5}
                />
              </div>
            </div>

            <h3>{title}</h3>

            <p>{text}</p>

            <span className="feature-line" />
          </motion.article>
        )
      )}
    </div>
  </section>
);

export default Features;