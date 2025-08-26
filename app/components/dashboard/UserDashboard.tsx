import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { APP_NAME, APP_SUBTITLE, COLORS, QUIZ_CATEGORIES } from '@/constants/Config';

interface UserDashboardProps {
  userData: any;
  onLogout?: () => void;
}

export default function UserDashboard({ userData, onLogout }: UserDashboardProps) {
  const [showProfile, setShowProfile] = useState(false);

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <ThemedText type="title" style={styles.appTitle}>
            {APP_NAME}
          </ThemedText>
          <ThemedText type="subtitle" style={styles.appSubtitle}>
            {APP_SUBTITLE}
          </ThemedText>
        </View>
        
        {/* Profile Icon */}
        <TouchableOpacity style={styles.profileButton} onPress={toggleProfile}>
          <IconSymbol size={28} name="person.circle.fill" color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.welcomeSection}>
          <ThemedText type="subtitle" style={styles.welcomeText}>
            Welcome back, {userData?.user?.name || 'User'}! 👋
          </ThemedText>
          <ThemedText style={styles.welcomeSubtext}>
            Ready to test your knowledge? Choose a category below to get started.
          </ThemedText>
        </View>
        
        <View style={styles.quizCategories}>
          <ThemedText type="subtitle" style={styles.categoriesTitle}>
            Available Quiz Categories
          </ThemedText>
          
          <View style={styles.categoryGrid}>
            {QUIZ_CATEGORIES.map((category) => (
              <TouchableOpacity 
                key={category.id}
                style={[styles.categoryCard, { borderLeftColor: category.color, borderLeftWidth: 4 }]}
              >
                <ThemedText type="defaultSemiBold" style={[styles.categoryTitle, { color: category.color }]}>
                  {category.title}
                </ThemedText>
                <ThemedText style={styles.categoryDesc}>
                  {category.description}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Profile Modal */}
      <Modal
        visible={showProfile}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleProfile}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.profileModal}>
            <View style={styles.modalHeader}>
              <ThemedText type="title" style={styles.modalTitle}>
                Profile Details
              </ThemedText>
              <TouchableOpacity onPress={toggleProfile} style={styles.closeButton}>
                <IconSymbol size={24} name="xmark.circle.fill" color="#6c757d" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              <View style={styles.profileAvatar}>
                <IconSymbol size={60} name="person.circle.fill" color={COLORS.primary} />
              </View>
              
              <ThemedText type="title" style={styles.profileName}>
                {userData?.user?.name || 'User Name'}
              </ThemedText>
              
              <ThemedText type="subtitle" style={styles.profileEmail}>
                {userData?.user?.email || 'user@example.com'}
              </ThemedText>
              
              <View style={styles.profileStats}>
                <View style={styles.statItem}>
                  <ThemedText type="defaultSemiBold" style={styles.statNumber}>
                    0
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>Quizzes Taken</ThemedText>
                </View>
                
                <View style={styles.statItem}>
                  <ThemedText type="defaultSemiBold" style={styles.statNumber}>
                    0%
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>Average Score</ThemedText>
                </View>
                
                <View style={styles.statItem}>
                  <ThemedText type="defaultSemiBold" style={styles.statNumber}>
                    New
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>Member Since</ThemedText>
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={() => {
                setShowProfile(false);
                onLogout?.();
              }}
            >
              <ThemedText type="defaultSemiBold" style={styles.logoutButtonText}>
                Logout
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  titleContainer: {
    flex: 1,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 2,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#6c757d',
  },
  profileButton: {
    padding: 8,
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: 20,
    color: '#495057',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
  quizCategories: {
    gap: 20,
  },
  categoriesTitle: {
    fontSize: 18,
    color: '#495057',
    marginBottom: 15,
    fontWeight: '600',
  },
  categoryGrid: {
    gap: 16,
  },
  categoryCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryTitle: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: '600',
  },
  categoryDesc: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileModal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    color: '#495057',
    fontWeight: '600',
  },
  closeButton: {
    padding: 5,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 25,
  },
  profileAvatar: {
    marginBottom: 15,
  },
  profileName: {
    fontSize: 22,
    color: '#495057',
    marginBottom: 5,
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 20,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
    gap: 5,
  },
  statNumber: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: COLORS.danger,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
