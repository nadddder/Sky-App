import { StyleSheet } from "react-native";

export const durationTestStyles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  calculating: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  totalDuration: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#2563eb',
  },
});

export const itemStyles = StyleSheet.create({
  container: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  videoId: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  duration: {
    fontSize: 14,
    color: '#059669',
    marginTop: 4,
  },
  error: {
    color: '#dc2626',
  },
  durationItem: {
    marginBottom: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
});

export const loadingScreenStyles = StyleSheet.create({
  container: {
    width: 350,
    height: 275,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  spinner: {
    marginVertical: 20,
  },
  status: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginTop: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4630ec',
    borderRadius: 2,
  },
});

export const videoPlayerStyles = StyleSheet.create({
  container: {
    width: 350,
    height: 275,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  error: {
    color: '#dc2626',
    textAlign: 'center',
    padding: 16,
  },
  controls: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  progressContainer: {
    marginBottom: 8,
    width: '100%',
    height: 4,
    backgroundColor: '#4b5563',
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playButton: {
    padding: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#ffffff',
  },
});

export const enahncedVideoPlayerStyles = StyleSheet.create({
  container: {
      width: 350,
      height: 275,
      backgroundColor: '#f3f4f6',
      borderRadius: 16,
      overflow: 'hidden',
  },
  video: {
      width: '100%',
      height: '100%',
  },
  error: {
      color: '#dc2626',
      textAlign: 'center',
      padding: 16,
  },
  controls: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      left: 0,
      padding: 16,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  progressContainer: {
      marginBottom: 8,
      width: '100%',
      height: 4,
      backgroundColor: '#4b5563',
      borderRadius: 2,
  },
  progressBar: {
      height: '100%',
      backgroundColor: '#ffffff',
      borderRadius: 2,
  },
  controlsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  playButton: {
      padding: 8,
  },
  timeText: {
      fontSize: 14,
      color: '#ffffff',
  },
});