import React from 'react';
import { Brain, Cpu, Shield, Zap } from 'lucide-react';
import styles from './styles/PrometheusHeader.module.scss';

const PrometheusHeader: React.FC = () => {
  return (
    <div className={styles.prometheusHeader}>
      {/* Animated scanning line */}
      <div className={styles.scanLine}></div>
      
      {/* Glowing corner accents */}
      <div className={`${styles.cornerGlow} ${styles.topLeft}`}></div>
      <div className={`${styles.cornerGlow} ${styles.topRight}`}></div>
      <div className={`${styles.cornerGlow} ${styles.bottomLeft}`}></div>
      <div className={`${styles.cornerGlow} ${styles.bottomRight}`}></div>

      <div className={styles.content}>
        <div className={styles.layoutContainer}>
          {/* Left Section: Logo and Title */}
          <div className={styles.leftSection}>
            <div className={styles.logoContainer}>
              <div className={styles.logo}>
                <Brain className="w-8 h-8 text-white" />
              </div>
              <Zap className={styles.sparkIcon} />
            </div>
            
            <div className={styles.titleSection}>
              <h1 className={styles.mainTitle}>
                <span className={styles.gradientText}>PROMETHEUS</span>
              </h1>
              <div className={styles.subtitle}>
                <div className={styles.statusIndicator}></div>
                <span className={styles.versionText}>Workforce Analytics v2.1</span>
              </div>
            </div>
          </div>

          {/* Right Section: Status Indicators */}
          <div className={styles.rightSection}>
            <div className={styles.statusGrid}>
              <div className={styles.statusItem}>
                <Cpu className={`${styles.statusIcon} ${styles.cpuIcon}`} />
                <span className={styles.statusLabel}>AI: ONLINE</span>
              </div>
              
              <div className={styles.statusItem}>
                <Shield className={`${styles.statusIcon} ${styles.shieldIcon}`} />
                <span className={styles.statusLabel}>SECURE</span>
              </div>
              
              <div className={styles.statusItem}>
                <div className={styles.liveIcon}></div>
                <span className={styles.statusLabel}>REALTIME</span>
              </div>
              
              <div className={styles.proprietaryBadge}>
                <span className={styles.badgeText}>PROPRIETARY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Feature Tags */}
        <div className={styles.divider}>
          <div className={styles.tagsContainer}>
            <span className={`${styles.tag} ${styles.cyanTag}`}>
              Neural Talent Predictions
            </span>
            <span className={`${styles.tag} ${styles.purpleTag}`}>
              Risk Intelligence Engine
            </span>
            <span className={`${styles.tag} ${styles.pinkTag}`}>
              Enterprise Analytics
            </span>
            <span className={`${styles.tag} ${styles.greenTag}`}>
              • LIVE DATA STREAM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrometheusHeader;
