# ffmpeg -i g-chord.wav -c:a libvorbis -qscale:a 10 g-chord.ogg
import os 
import subprocess

# chords = ['eb', 'bb', 'f', 'c', 'g', 'd', 'a', 'e', 'b',
  # 'ebm', 'bbm', 'fm', 'cm', 'gm', 'dm', 'am', 'em', 'bm',
  # 'eb7', 'bb7', 'f7', 'c7', 'g7', 'd7', 'a7', 'e7', 'b7'];
chords = ['a']


for chord in chords:
    for fn in os.listdir('./{}'.format(chord)):
        parts = fn.split('.')
        name = parts[0]
        ext = parts[1]
        # If the file is a .wav file and we haven't converted it, convert it
        if ext == 'wav' and len(parts) == 2 and not os.path.isfile('./{}/{}.ogg'.format(chord, name)):
            toconvert = './{}/{}'.format(chord, fn)
            converted = './{}/{}'.format(chord, name + '.ogg')
            print 'Converting {} to {}'.format(toconvert, converted)
            subprocess.call('ffmpeg -i {} -c:a libvorbis -qscale:a 10 {}'.format(toconvert, converted), shell=True)
